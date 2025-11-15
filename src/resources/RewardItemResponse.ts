export interface RewardItemResponse {
    tasks: Task[];
}

export interface Task {
    id: string;
    finishRewards: FinishedRewards;
}

export interface FinishedRewards {
    offerUnlock: OfferUnlock[];
    craftUnlock: CraftUnlock[];
}

export interface OfferUnlock {
    item: Item;
}

export interface CraftUnlock {
    rewardItems: ContainedItems[]
}

export interface ContainedItems {
    item: Item;
}

export interface Item {
    id: string;
    name: string;
}
