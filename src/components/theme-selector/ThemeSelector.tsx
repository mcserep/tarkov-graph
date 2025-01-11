import LightModeIcon from '@mui/icons-material/LightMode';
import './ThemeSelector.css'
import {IconButton} from "@mui/material";
import {darkTheme, lightTheme, useThemeContext} from "./ThemeContext.ts";
import {useEffect, useState} from "react";
import {PaletteMode} from "@mui/material/styles/createPalette";

export function ThemeSelector() {
    const {theme, setTheme} = useThemeContext();
    const THEME_VARIABLE_NAME = 'theme';
    const [storedTheme] = useState<PaletteMode>((localStorage.getItem(THEME_VARIABLE_NAME) || 'dark') as PaletteMode);

    useEffect(() => {
        switch (storedTheme) {
            case 'dark': {
                setTheme(darkTheme);
                break;
            }
            case "light": {
                setTheme(lightTheme);
                break
            }
        }
        // eslint-disable-next-line
    }, [storedTheme]);
    useEffect(() => {
        localStorage.setItem(THEME_VARIABLE_NAME, theme?.palette.mode || 'dark');
    }, [theme]);

    function toggleTheme() {
        if (theme === null || theme.palette.mode === 'light') {
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
