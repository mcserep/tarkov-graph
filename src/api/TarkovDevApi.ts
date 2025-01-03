import {GraphQLClient} from 'graphql-request';
import {TaskResponse} from '../resources/TaskResponse.ts';

const endpoint = 'https://api.tarkov.dev/graphql';
const query = `
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

export async function fetchAllTasks() {
    const client = new GraphQLClient(endpoint);
    return await client.request<TaskResponse>(query);
}

