import {createContext, useContext} from "react";
import {createTheme, Theme} from "@mui/material";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark'
    }
});

export const lightTheme = createTheme({
    palette: {
        mode: 'light'
    }
});

export const ThemeContext = createContext({
    theme: null as unknown as null | Theme,
    setTheme: (theme: Theme) => {
        console.log("setTheme not defined", theme);
    }
});
export const useThemeContext = () => useContext(ThemeContext);
