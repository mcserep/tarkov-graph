import {IconButton} from "@mui/material";
import {PaletteMode} from "@mui/material/styles/createPalette";
import LightModeIcon from '@mui/icons-material/LightMode';

import './ThemeSelector.css'

type Props = {
    theme: PaletteMode,
    setTheme: (theme: PaletteMode) => void,
}

export function ThemeSelector({
    theme,
    setTheme,
}: Props) {
    function toggleTheme() {
        if (theme !== 'light') {
            setTheme('light');
        } else {
            setTheme('dark');
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
