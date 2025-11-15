import {GraphQLClient} from 'graphql-request';
import {TaskResponse} from '../resources/TaskResponse.ts';
import {RewardItemResponse} from '../resources/RewardItemResponse.ts';

const endpoint = 'https://api.tarkov.dev/graphql';

const tasksQuery = `
{
    tasks(lang: en) {
        id
        name
        minPlayerLevel
        wikiLink
        taskImageLink
        trader {
            name
        }
        taskRequirements {
            task {
                id
            }
        }
    }
}`;

const rewardItemsQuery = `
{
    tasks(lang: en) {
        id
        finishRewards {
            offerUnlock {
                item {
                    id
                    name
                }   
            }
            craftUnlock {
                rewardItems {
                    item {
                        id
                        name
                    }
                }
            }
        }
    }
}`;

export class TarkovDevApi {
    private client: GraphQLClient;

    constructor() {
        this.client = new GraphQLClient(endpoint);
    }

    async fetchTasks(): Promise<TaskResponse> {
        return await this.client.request<TaskResponse>(tasksQuery);
    }

    async fetchRewardItems(): Promise<RewardItemResponse> {
        return await this.client.request<RewardItemResponse>(rewardItemsQuery);
    }
}
