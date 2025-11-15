import {useEffect, useRef, useState} from 'react';
import {Button, TextField, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent} from '@mui/material';
import {useSnackbar} from 'notistack';

import {TarkovTrackerApi, TarkovTrackerServer} from '@/api/TarkovTrackerApi.ts';
import {ProgressData} from '@/resources/ProgressResponse.ts';

type Props = {
    onProgressLoaded: (userProgress: ProgressData, teamProgress: ProgressData[]) => void;
}

export function TarkovTracker({
    onProgressLoaded,
}: Props) {
    const inputTokenRef = useRef<HTMLInputElement>(null);
    const [trackerToken, setTrackerToken] = useState<string>(localStorage.getItem('tarkovTrackerToken') ?? '');
    const [trackerServer, setTrackerServer] = useState<TarkovTrackerServer>(
        (localStorage.getItem('tarkovTrackerServer') as TarkovTrackerServer) ?? 'tarkovtracker.io'
    );

    const [userProgress, setUserProgress] = useState<ProgressData | null>(null);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    useEffect(() => {
        const fetchProgress = async () => {
            if (trackerToken.length === 0) {
                return;
            }

            const api = new TarkovTrackerApi(trackerToken, trackerServer);

            let loadSnackKey = enqueueSnackbar('Fetching token permissions...', {variant: 'info'});
            try {
                const permissions = await api.fetchTokenPermissions();
                closeSnackbar(loadSnackKey);

                if (!permissions.includes('GP')) {
                    enqueueSnackbar('The provided token does not have the required permission "Get Personal Progress".', {variant: 'error'});
                    return;
                }

                loadSnackKey = enqueueSnackbar('Fetching user progress...', {variant: 'info'});
                const userProgress = await api.fetchUserProgress();
                setUserProgress(userProgress);

                let teamProgress: ProgressData[] = [];
                if (permissions.includes('TP')) {
                    closeSnackbar(loadSnackKey);

                    loadSnackKey = enqueueSnackbar('Fetching team progress...', {variant: 'info'});
                    teamProgress = await api.fetchTeamProgress();
                }

                onProgressLoaded(userProgress, teamProgress);
            } catch (err) {
                enqueueSnackbar(`Tarkov Tracker Error: ${(err as Error).message}`, {variant: 'error'});
            } finally {
                closeSnackbar(loadSnackKey);
            }
        };

        fetchProgress();
        // This rule is disabled, because it wants to add onProgressLoaded to the dependency array,
        // which would cause an infinite loop of re-renders.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackerToken, trackerServer]);

    const handleSetToken = () => {
        if (inputTokenRef.current) {
            setTrackerToken(inputTokenRef.current.value);
            localStorage.setItem('tarkovTrackerToken', inputTokenRef.current.value);
        }
    };

    const handleClearToken = () => {
        setTrackerToken('');
        localStorage.removeItem('tarkovTrackerToken');
    };

    const handleServerChange = (event: SelectChangeEvent<TarkovTrackerServer>) => {
        const newServer = event.target.value as TarkovTrackerServer;
        setTrackerServer(newServer);
        localStorage.setItem('tarkovTrackerServer', newServer);
    };

    return (
        <>
            <Typography variant="subtitle1" gutterBottom>
                Tarkov Tracker
            </Typography>
            {trackerToken.length > 0 ?
                <>
                    {userProgress ?
                        <>
                            <Typography variant="body1">
                                <strong>{userProgress?.displayName}</strong> ({userProgress?.playerLevel})
                            </Typography>
                        </> : null}
                    <Button variant="contained"
                            fullWidth
                            onClick={handleClearToken}>
                        Clear token
                    </Button>
                </>
                :
                <>
                    <FormControl fullWidth size="small" sx={{mb: 2}}>
                        <InputLabel id="server-select-label">Server</InputLabel>
                        <Select
                            labelId="server-select-label"
                            value={trackerServer}
                            label="Server"
                            onChange={handleServerChange}
                        >
                            <MenuItem value="tarkovtracker.io">tarkovtracker.io</MenuItem>
                            <MenuItem value="tarkovtracker.org">tarkovtracker.org</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Token"
                        variant="outlined"
                        size="small"
                        sx={{mb: 2}}
                        inputRef={inputTokenRef}
                    />
                    <Button variant="contained"
                            fullWidth
                            onClick={handleSetToken}>
                        Set Token
                    </Button>
                </>
            }
        </>
    )
}
