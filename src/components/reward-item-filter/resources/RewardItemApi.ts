import {GraphQLClient} from "graphql-request";
import {endpoint} from "@/api/TarkovDevApi.ts";
import {RewardItemResponse} from "./RewardItemResponse.ts";

export class RewardItemApi {
    static async fetchTaskRewardItems() {
        const client = new GraphQLClient(endpoint);
        return await client.request<RewardItemResponse>(`{
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
    }`);
    }

}
