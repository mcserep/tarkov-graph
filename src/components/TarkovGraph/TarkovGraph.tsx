import {useEffect, useState} from 'react';
import {useSnackbar} from 'notistack';
import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import dagre from 'cytoscape-dagre';
import {ClientError} from 'graphql-request'

import * as TarkovDevApi from "@/api/TarkovDevApi.ts";
import {Task} from '@/resources/TaskResponse.ts';
import {ProgressData} from '@/resources/ProgressResponse.ts';
import {GraphLayout, GraphStylesheet} from '@/utils/GraphDecorator.ts';

import './TarkovGraph.css'

type Props = {
    progress: ProgressData | null;
    targetTaskIds: Set<string>;
    setTargetTaskIds: (taskIds: Set<string>) => void;
}

export function TarkovGraph({
    progress,
    targetTaskIds,
    setTargetTaskIds,
}: Props) {
    Cytoscape.use(dagre); // Register the dagre layout extension

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [graphApi, setGraphApi] = useState<Cytoscape.Core | undefined>(undefined);

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            const loadSnackKey = enqueueSnackbar('Fetching Tarkov tasks...', {variant: 'info'});

            try {
                const data = await TarkovDevApi.fetchAllTasks();
                setTasks(data.tasks);
            } catch (err) {
                if (err instanceof ClientError) {
                    // Handle GraphQL errors
                    const graphqlErrors = err.response.errors; // Array of GraphQLError
                    const message = graphqlErrors?.map((e) => e.message).join(', ');
                    enqueueSnackbar(`GraphQL Error: ${message}`, {variant: 'error'});
                } else {
                    // Handle non-GraphQL (network or other) errors
                    enqueueSnackbar(`Network Error: ${(err as Error).message}`, {variant: 'error'});
                }
            } finally {
                setIsLoading(false);
                closeSnackbar(loadSnackKey);
            }
        };

        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!graphApi) return;
        graphApi.edges().removeClass('highlighted'); // Remove the highlighted class from all edges
        if (targetTaskIds.size === 0) return;

        for (const targetTaskId of targetTaskIds) {
            const node = graphApi.getElementById(targetTaskId);
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
        }
    }, [graphApi, targetTaskIds]);

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

    const onNodeClick = (event: Cytoscape.EventObject) => {
        const taskId = event.target[0].id();
        if (!targetTaskIds.delete(taskId)) {
            targetTaskIds.add(taskId);
        }
        setTargetTaskIds(new Set<string>(targetTaskIds));
    };

    return (
        <>
            {isLoading ?
                <p className="center-screen">Loading...</p>
                :
                <CytoscapeComponent
                    id="cytoscape"
                    autounselectify={true}
                    elements={elements}
                    layout={GraphLayout}
                    stylesheet={GraphStylesheet}
                    cy={(cy) => {
                        setGraphApi(cy);
                        cy.on('tap', 'node', onNodeClick); // Bind the tap event for node clicks
                    }}/>
            }
        </>
    )
}
