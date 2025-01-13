import {IconButton, Theme} from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';

import './ThemeSelector.css'
import {darkTheme, lightTheme} from "./Themes.ts";
import {useEffect} from "react";
import {PaletteMode} from "@mui/material/styles/createPalette";

type Props = {
    theme: Theme,
    setTheme: (theme: Theme) => void,
}

const THEME_VARIABLE_NAME = 'theme';


export function ThemeSelector({
                                  theme,
                                  setTheme,
                              }: Props) {
    useEffect(() => {
        const storedTheme = getStoredTheme();
        setTheme(storedTheme);
    }, []);

    useEffect(() => {
        if (theme === lightTheme || theme === darkTheme) {
            localStorage.setItem(THEME_VARIABLE_NAME, theme.palette.mode);
        }
    }, [theme]);

    function getStoredTheme() {
        const storedPaletteMode = (localStorage.getItem(THEME_VARIABLE_NAME) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')) as PaletteMode;
        switch (storedPaletteMode) {
            case 'dark':
                return darkTheme;
            case 'light':
                return lightTheme
        }
    }

    function toggleTheme() {
        if (theme === lightTheme) {
            setTheme(darkTheme);
        } else {
            setTheme(lightTheme);
        }
    }

    return (
        <div className="theme-selector">
            <IconButton aria-label="Switch Theme" onClick={toggleTheme}>
                <LightModeIcon></LightModeIcon>
            </IconButton>
        </div>
    );
}
