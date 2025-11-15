import {GraphQLClient} from 'graphql-request';
import {TaskResponse} from '../resources/TaskResponse.ts';
import {RewardItemResponse} from '../resources/RewardItemResponse.ts';

export const endpoint = 'https://api.tarkov.dev/graphql';

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

export async function fetchTasks() {
    const client = new GraphQLClient(endpoint);
    return await client.request<TaskResponse>(tasksQuery);
}

export async function fetchRewardItems() {
    const client = new GraphQLClient(endpoint);
    return await client.request<RewardItemResponse>(rewardItemsQuery);
}

