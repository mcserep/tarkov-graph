import {ProgressData, ProgressResponse, TeamProgressResponse} from '../resources/ProgressResponse.ts';
import {TokenPermission, TokenResponse} from '../resources/TokenResponse.ts';

export type TarkovTrackerServer = 'tarkovtracker.io' | 'tarkovtracker.org';

export class TarkovTrackerApi {
    private token: string;
    private endpoint: string;

    constructor(token: string, server: TarkovTrackerServer = 'tarkovtracker.io') {
        this.token = token;
        this.endpoint = `https://${server}/api/v2`;
    }

    async fetchTokenPermissions(): Promise<TokenPermission[]> {
        const response = await fetch(`${this.endpoint}/token`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const result: TokenResponse = await response.json();
        return result.permissions;
    }

    async fetchUserProgress(): Promise<ProgressData> {
        const response = await fetch(`${this.endpoint}/progress`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const result: ProgressResponse = await response.json();
        return result.data;
    }

    async fetchTeamProgress(): Promise<ProgressData[]> {
        const response = await fetch(`${this.endpoint}/team/progress`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const result: TeamProgressResponse = await response.json();
        return result.data;
    }
}
