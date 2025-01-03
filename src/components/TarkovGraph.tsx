import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {useEffect, useRef, useState} from 'react';
import {ClientError} from 'graphql-request'
import {Button, Toast, ToastContainer} from 'react-bootstrap';

import * as TarkovDevApi from "../api/TarkovDevApi.ts";
import * as TarkovTrackerApi from "../api/TarkovTrackerApi.ts";
import {Task} from '../resources/TaskResponse.ts';
import {ProgressData} from '../resources/ProgressResponse.ts';
import {GraphLayout, GraphStylesheet} from '../utils/GraphDecorator.ts';

import './TarkovGraph.css'

export function TarkovGraph() {
    Cytoscape.use(dagre); // Register the dagre layout extension

    const [tasks, setTasks] = useState<Task[]>([]);
    const [progress, setProgress] = useState<ProgressData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorShowing, setErrorShowing] = useState(false);

    const inputTokenRef = useRef<HTMLInputElement>(null);
    const [tarkovTrackerToken, setTarkovTrackerToken] = useState<string>('');

    const storedToken = localStorage.getItem('tarkovTrackerToken');
    if (storedToken && tarkovTrackerToken.length === 0) {
        setTarkovTrackerToken(storedToken as string);
    }

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const data = await TarkovDevApi.fetchAllTasks();
                setTasks(data.tasks);
            } catch (err) {
                if (err instanceof ClientError) {
                    // Handle GraphQL errors
                    const graphqlErrors = err.response.errors; // Array of GraphQLError
                    const message = graphqlErrors?.map((e) => e.message).join(', ');
                    setError(`GraphQL Error: ${message}`);
                } else {
                    // Handle non-GraphQL (network or other) errors
                    setError(`Network Error: ${(err as Error).message}`);
                }
                setErrorShowing(true);
            } finally {
                setLoading(false);
            }
        };

        const fetchProgress = async () => {
            if (tarkovTrackerToken.length === 0) {
                return;
            }

            setLoading(true);
            try {
                const data = await TarkovTrackerApi.fetchUserProgress(tarkovTrackerToken);
                setProgress(data);
            } catch (err) {
                setError(`Tarkov Tracker Error: ${(err as Error).message}`);
                setErrorShowing(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks().then(async () =>  {
            if (!error) {
                fetchProgress()
            }
        });
    }, [tarkovTrackerToken]);

    // Build the graph
    const nodes: Cytoscape.NodeDefinition[] = [];
    const edges: Cytoscape.EdgeDefinition[] = [];
    tasks.forEach((task) => {
        if (task.taskRequirements.length > 50)
            return;

        nodes.push({
            data: {
                id: task.id,
                label: task.name,
                trader: task.trader.name,
                level: task.minPlayerLevel,
                wikiLink: task.wikiLink,
                imageLink: task.taskImageLink
            }
        });
        task.taskRequirements.forEach((req) => {
            edges.push({
                data: {
                    source: req.task.id,
                    target: task.id
                }
            });
        });
    });

    progress?.tasksProgress.forEach((taskProgress) => {
        const node = nodes.find((node) => node.data.id === taskProgress.id);
        if (node) {
            node.classes = 'completed';
        }

        edges
            .filter((edge) => edge.data.source === taskProgress.id)
            .forEach((edge) => {
                edge.classes = 'completed';
            });
    });

    const elements = CytoscapeComponent.normalizeElements({nodes, edges});

    const handleSetToken = () => {
        if (inputTokenRef.current) {
            setTarkovTrackerToken(inputTokenRef.current.value);
            localStorage.setItem('tarkovTrackerToken', inputTokenRef.current.value);
        }
    };

    const handleClearToken = () => {
        setTasks([]);
        setProgress(null);
        setTarkovTrackerToken('');
        localStorage.removeItem('tarkovTrackerToken');
    };

    const onNodeClick = (event: Cytoscape.EventObject) => {
        event.cy.edges().removeClass('highlighted'); // Remove the highlighted class from all edges

        const node = event.target;
        const allEdges = node.incomers('edge');

        const highlightEdges = (edges: Cytoscape.EdgeCollection) => {
            edges.addClass('highlighted');
            edges.forEach((edge) => {
                const sourceNode = edge.source();
                const transitiveEdges = sourceNode.incomers('edge');
                highlightEdges(transitiveEdges);
            });
        };

        highlightEdges(allEdges);
    };

    if (loading) return <p className="center-screen">Loading...</p>;

    return (
        <>
            <ToastContainer position={'top-end'} style={{zIndex: 300}}>
                <Toast
                    show={errorShowing}
                    onClose={() => setErrorShowing(false)}
                    bg="danger">
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            </ToastContainer>
            <CytoscapeComponent id="cytoscape"
                                autounselectify={true}
                                elements={elements}
                                layout={GraphLayout}
                                stylesheet={GraphStylesheet}
                                cy={(cy) => {
                                    cy.on('tap', 'node', onNodeClick); // Bind the tap event for node clicks
                                }} />

            <div id="tarkov-tracker">
                <h2>Tarkov Tracker</h2>
                {tarkovTrackerToken.length > 0 ?
                    <>
                        {progress ?
                            <>
                                <p>Username: {progress?.displayName}</p>
                                <p>Level: {progress?.playerLevel}</p>
                            </> : null }
                        <Button variant="primary" onClick={handleClearToken}>Clear token</Button>
                    </>
                    :
                    <>
                        <p>
                            <label htmlFor="token">Token:</label><br />
                            <input type="text" name="token" ref={inputTokenRef} style={{width: '300px'}}/>
                        </p>
                        <p>
                            <Button variant="primary" onClick={handleSetToken}>Set token</Button>
                        </p>
                    </>}
            </div>
        </>
    )
}
