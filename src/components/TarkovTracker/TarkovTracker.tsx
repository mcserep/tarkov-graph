import {useEffect, useRef, useState} from 'react';
import {Button, TextField, Typography} from '@mui/material';
import {useSnackbar} from 'notistack';

import * as TarkovTrackerApi from '@/api/TarkovTrackerApi.ts';
import {ProgressData} from '@/resources/ProgressResponse.ts';

type Props = {
    onProgressLoaded: (progress: ProgressData) => void;
}

export function TarkovTracker({
    onProgressLoaded
}: Props) {
    const inputTokenRef = useRef<HTMLInputElement>(null);
    const [trackerToken, setTrackerToken] = useState<string>(localStorage.getItem('tarkovTrackerToken') ?? '');

    const [progress, setProgress] = useState<ProgressData | null>(null);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    useEffect(() => {
        const fetchProgress = async () => {
            if (trackerToken.length === 0) {
                return;
            }

            const loadSnackKey = enqueueSnackbar('Fetching user progress...', {variant: 'info'});
            try {
                const data = await TarkovTrackerApi.fetchUserProgress(trackerToken);
                setProgress(data);
                onProgressLoaded(data);
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
    }, [trackerToken]);

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

    return (
        <>
            <Typography variant="subtitle1" gutterBottom>
                Tarkov Tracker
            </Typography>
            {trackerToken.length > 0 ?
                <>
                    {progress ?
                        <>
                            <Typography variant="body1">
                                <strong>{progress?.displayName}</strong> ({progress?.playerLevel})
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
