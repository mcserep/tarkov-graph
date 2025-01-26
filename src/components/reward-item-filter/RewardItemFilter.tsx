import './RewardItemFilter.module.css';
import {Autocomplete, TextField} from "@mui/material";
import {SyntheticEvent, useEffect, useState} from "react";
import {RewardItemApi} from "./resources/RewardItemApi.ts";
import {Item, RewardItemResponse} from "./resources/RewardItemResponse.ts";

interface TaskRewardItem {
    itemId: string;
    itemName: string;
    taskIds: Set<string>;
}

type Props = {
    handleRewardItemSelected: (itemId: TaskRewardItem | null) => void;
}

export function RewardItemFilter({
                                     handleRewardItemSelected
                                 }: Props) {

    const [taskRewards, setTaskRewards] = useState([] as TaskRewardItem[]);

    useEffect(() => {
        const fetchTaskRewards = async () => {
            const taskResponse = await RewardItemApi.fetchTaskRewardItems();
            const rewardItems = buildRewardItemArray(taskResponse);
            setTaskRewards(rewardItems);
        };
        fetchTaskRewards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function buildRewardItemArray(taskResponse: RewardItemResponse) {
        const rewardItemsByItemId = new Map<string, TaskRewardItem>();
        for (const task of taskResponse.tasks) {
            for (const offerUnlock of task.finishRewards.offerUnlock) {
                getRewardItem(rewardItemsByItemId, offerUnlock.item).taskIds.add(task.id);
            }
            for (const craftUnlock of task.finishRewards.craftUnlock) {
                for (const rewardItem of craftUnlock.rewardItems) {
                    getRewardItem(rewardItemsByItemId, rewardItem.item).taskIds.add(task.id);
                }
            }
        }
        return [...rewardItemsByItemId.values()].sort((a, b) => a.itemName.localeCompare(b.itemName));
    }

    function getRewardItem(rewardItemsByItemId: Map<string, TaskRewardItem>, item: Item) {
        let rewardItem = rewardItemsByItemId.get(item.id);
        if (!rewardItem) {
            rewardItem = {
                itemId: item.id,
                itemName: item.name,
                taskIds: new Set<string>(),
            } as TaskRewardItem;
            rewardItemsByItemId.set(rewardItem.itemId, rewardItem);
        }
        return rewardItem;
    }

    const handleItemSelected = (_: SyntheticEvent, value: TaskRewardItem | null) => {
        handleRewardItemSelected(value);
    }

    return (
        <>
            <Autocomplete
                disablePortal
                options={taskRewards}
                getOptionLabel={(option: TaskRewardItem) => option.itemName}
                isOptionEqualToValue={(option, value) => option.itemId === value.itemId}
                sx={{}}
                renderInput={(params) => <TextField {...params} label="Reward item name"/>}
                onChange={handleItemSelected}
            />
        </>
    );
}
