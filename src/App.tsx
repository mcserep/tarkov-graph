import {useState} from 'react';
import {Box, CssBaseline, Drawer, Typography} from '@mui/material';
import {SnackbarProvider} from 'notistack';

import {TarkovGraph} from './components/TarkovGraph.tsx';
import {TarkovTracker} from './components/TarkovTracker.tsx';
import {ProgressData} from './resources/ProgressResponse.ts';
import {GitHubCorner} from './components/GitHubCorner.tsx';

import './App.css'

function App() {
    const [userProgress, setUserProgress] = useState<ProgressData | null>(null);

    const handleUserProgressLoaded = (progress: ProgressData) => {
        setUserProgress(progress);
    };

    return (
        <SnackbarProvider
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={5000}
            maxSnack={10}
            preventDuplicate={true}>
            <Box sx={{display: "flex"}}>
                <CssBaseline/>

                {/* Sidebar */}
                <Drawer
                    variant="permanent"
                    sx={{
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: 240,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                        {/* Title */}
                        <Box sx={{p: 2, borderBottom: "1px solid #ddd"}}>
                            <Typography variant="h1" sx={{fontSize: '1.5em'}}>Escape from Tarkov</Typography>
                            <Typography variant="subtitle1">Task Graph</Typography>
                        </Box>

                        {/* Spacer */}
                        <Box sx={{flexGrow: 1}}/>

                        {/* Form */}
                        <Box sx={{p: 2, borderTop: "1px solid #ddd"}}>
                            <TarkovTracker
                                onProgressLoaded={handleUserProgressLoaded} />
                        </Box>
                    </Box>
                </Drawer>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{flexGrow: 1, bgcolor: "background.default"}}
                >
                    <TarkovGraph
                        progress={userProgress}/>
                </Box>
            </Box>

           <GitHubCorner url="https://github.com/mcserep/tarkov-graph" />
        </SnackbarProvider>
    )
}

export default App
