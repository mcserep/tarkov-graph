import {ProgressData, ProgressResponse} from '../resources/ProgressResponse.ts';

export type TarkovTrackerServer = 'tarkovtracker.io' | 'tarkovtracker.org';

function getEndpoint(server: TarkovTrackerServer): string {
    return `https://${server}/api/v2`;
}

export async function fetchUserProgress(token: string, server: TarkovTrackerServer = 'tarkovtracker.io'): Promise<ProgressData> {
    const endpoint = getEndpoint(server);
    const response = await fetch(`${endpoint}/progress`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const result: ProgressResponse = await response.json();
    return result.data;
}
