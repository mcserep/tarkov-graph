export interface Trader {
    name: string;
}

export interface TaskRequirement {
    task: {
        id: string;
    }
}
export interface Task {
    id: string;
    name: string;
    minPlayerLevel: number;
    wikiLink: string;
    taskImageLink: string;
    trader: Trader;
    taskRequirements: TaskRequirement[];
}

export interface TaskResponse {
    tasks: Task[];
}
