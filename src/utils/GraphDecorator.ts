import Cytoscape from 'cytoscape';

function getNodeColor(trader: string): string
{
    switch (trader) {
        case 'Prapor':
            return '#dd4e16';
        case 'Therapist':
            return '#8585f7';
        case 'Skier':
            return '#ed90a0';
        case 'Peacekeeper':
            return '#0b896c';
        case 'Mechanic':
            return '#f7a900';
        case 'Ragman':
            return '#baba1f';
        case 'Jaeger':
            return '#a053a0';
        case 'Ref':
            return '#a57e29';
        case 'Fence':
            return '#8e8e8e';
        default:
            return '#606060';
    }
}

function getNodeImage(trader: string): string
{
    return `https://tarkov.dev/images/traders/${trader.toLowerCase()}-portrait.png`;
}

function getNodeWidth(label: string): number
{
    if (label.length <= 20) {
        return 200;
    }
    return 200 + ((label.length - 20) * 10);
}

function getNodeLabelPosition(label: string): number
{
    if (label.length <= 20) {
        return -145;
    }
    return -145 - ((label.length - 20) * 10);
}

export const GraphStylesheet: Cytoscape.StylesheetStyle[] = [
    {
        selector: 'node',
        style: {
            label: 'data(label)', // Use the `label` attribute for node text
            width: (node: Cytoscape.NodeSingular) => getNodeWidth(node.data('label')),
            height: 50,
            shape: 'rectangle',
            color: '#fff',
            'text-halign': 'right',
            'text-valign': 'center',
            'background-color': (node: Cytoscape.NodeSingular) => getNodeColor(node.data('trader')),
            'background-image': (node: Cytoscape.NodeSingular) => getNodeImage(node.data('trader')),
            'background-fit': 'contain',
            'background-position-x': '0',
            'text-margin-x': (node: Cytoscape.NodeSingular) => getNodeLabelPosition(node.data('label')),
        },
    },
    {
        selector: 'edge',
        style: {
            'label': 'data(label)', // Use the `label` attribute for edge text
            width: 2,
            'arrow-scale': 2,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            // @ts-expect-error It seems that Cytoscape type definitions are missing 'edge-text-rotation'.
            'edge-text-rotation': 'autorotate', // rotate text along the edge
            'text-margin-y': -8, // moves text away from the line
        },
    },
    {
        selector: 'edge.highlighted',
        style: {
            'line-color': 'red',
            'target-arrow-color': 'red',
            'width': 4,
        },
    },
    {
        selector: 'edge.completed',
        style: {
            'line-color': 'green',
            'target-arrow-color': 'green',
        },
    },
    {
        selector: 'node.completed',
        style: {},
    },
];

export const GraphLayout = {
    name: 'dagre',
    spacingFactor: 1.2,
    rankDir: 'LR',
    edgeWeight: function (edge: Cytoscape.EdgeSingular) {
        if (edge.source().data('trader') === edge.target().data('trader')) {
            return 4;
        }
        return 1;
    }
};
