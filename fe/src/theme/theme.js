import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light", // Change to "dark" for dark mode
        primary: {
            main: "#1976d2", // Custom primary color
        },
        secondary: {
            main: "#dc004e", // Custom secondary color
        },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
        },
        button: {
            textTransform: "none", // Prevents uppercase text on buttons
        },
    },
});

export default theme;
