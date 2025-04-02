import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light", // Change to "dark" for dark mode
        primary: {
            main: "#F13067", 
        },
        secondary: {
            main: "#dc004e", 
        },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
        h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
        },
        h5: {
            fontSize: "1.5rem", // Default h5 size
            fontWeight: 500, // Default h5 weight
            color: "#091B65", // Specific color for Xin chào
        },
        button: {
            textTransform: "none", 
        },
    },
    components: {
        // Customize TextField border and label
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#F13067", // Default border color
                        },
                        "&:hover fieldset": {
                            borderColor: "#F13067", // Hover border color
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#F13067", // Focused border color
                        },
                    },
                    "& .MuiInputLabel-root": {
                        color: "#F13067", // Default label color
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "#F13067", // Focused label color
                    },
                },
            },
        },
        // Ensure button uses primary color
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: "#F13067", // Ensure contained buttons use primary color
                    "&:hover": {
                        backgroundColor: "#D12A58", // Slightly darker shade for hover
                    },
                },
            },
        },
    },
});

export default theme;