import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F13067",
    },
    darkBrown: "#493628",
    lightGray: "#F6F6F6",
    darkPink: "#ED1E79",
    lightBlue: "#AEDCF4",
    lightPink: "#FEC9D9",
    darkBlue: "#091B65",
    white: "#fff",
    secondary: {
      main: "#dc004e",
    },
    ochre: {
      main: "#E3D026",
      lightGrey: "#D9D9D9",
      dark: "#000000",
      white: "#fff",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#091B65",
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
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
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#F13067",
          "&:hover": {
            backgroundColor: "#D12A58",
          },
        },
      },
    },
  },
});

export default theme;
