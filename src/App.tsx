import {useState} from 'react';
import {Box, createTheme, CssBaseline, Drawer, Theme, ThemeProvider, Typography} from '@mui/material';
import {SnackbarProvider} from 'notistack';
import {TarkovTracker} from '@/components/TarkovTracker/TarkovTracker.tsx';
import {ProgressData} from '@/resources/ProgressResponse.ts';
import {GitHubCorner} from '@/components/GitHubCorner/GitHubCorner.tsx';
import {ThemeSelector} from "@/components/ThemeSelector/ThemeSelector.tsx";
import {TarkovGraph} from "@/components/TarkovGraph/TarkovGraph.tsx";
import {RewardItemFilter} from "@/components/reward-item-filter/RewardItemFilter.tsx";

import './App.css'

function App() {
    const [userProgress, setUserProgress] = useState<ProgressData | null>(null);
    const [theme, setTheme] = useState<Theme>(createTheme());
    const [targetTaskIds, setTargetTaskIds] = useState<Set<string>>(new Set<string>());

    const handleUserProgressLoaded = (progress: ProgressData) => {
        setUserProgress(progress);
    };

    return (
        <ThemeProvider theme={theme}>
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
                                <RewardItemFilter
                                    handleRewardItemSelected={item => {
                                        if (!item) {
                                            setTargetTaskIds(new Set<string>());
                                        } else {
                                            setTargetTaskIds(new Set<string>(item.taskIds));
                                        }
                                    }}/>
                                <TarkovTracker
                                    onProgressLoaded={handleUserProgressLoaded}/>
                            </Box>
                        </Box>
                    </Drawer>

                    {/* Main Content */}
                    <Box
                        component="main"
                        sx={{
                            bgcolor: "background.default",
                            marginLeft: '240px',
                            width: 'calc(100% - 240px)',
                        }}>
                        <div className="theme-selector-div">
                            <ThemeSelector theme={theme} setTheme={setTheme}/>
                        </div>
                        <TarkovGraph
                            targetTaskIds={targetTaskIds}
                            setTargetTaskIds={setTargetTaskIds}
                            progress={userProgress}/>
                    </Box>
                </Box>

                <GitHubCorner url="https://github.com/mcserep/tarkov-graph"/>
            </SnackbarProvider>
        </ThemeProvider>
    )
}

export default App
