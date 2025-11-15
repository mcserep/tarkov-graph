export type TokenPermission = 'GP' | 'TP' | 'WP';

export interface TokenResponse {
    token: string;
    description: string;
    permissions: TokenPermission[];
}
