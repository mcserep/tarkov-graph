export interface TaskProgress {
    id: string;
    complete: boolean;
    invalid: boolean;
}

export interface ProgressData {
    tasksProgress: TaskProgress[];
    displayName: string;
    userId: string;
    playerLevel: number;
    gameEdition: number;
    pmcFaction: string;
}

export interface ProgressResponse {
    data: ProgressData;
}
