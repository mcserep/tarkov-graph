import {ProgressData, ProgressResponse} from '../resources/ProgressResponse.ts';

const endpoint = 'https://tarkovtracker.io/api/v2';

export async function fetchUserProgress(token: string): Promise<ProgressData> {
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
