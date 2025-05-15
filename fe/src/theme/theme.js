import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F13067",
      dark: "#D12A58", // Adding explicit dark variant for consistency
    },
    darkBrown: "#493628",
    lightGray: "#F6F6F6",
    mediumGray: "#67686c",
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
    // New component for FullCalendar styling
    MuiCssBaseline: {
      styleOverrides: {
        // Global styles for FullCalendar
        ".fc-addEvent-button, .fc-button-primary.fc-addEvent-button": {
          backgroundColor: "#F13067 !important",
          borderColor: "#F13067 !important",
          color: "#fff !important",
          fontSize: "15px !important",
          padding: "8px 18px !important",
          borderRadius: "20px !important",
          "&:hover": {
            backgroundColor: "#D12A58 !important",
            borderColor: "#D12A58 !important",
          },
          "&:focus": {
            boxShadow: "0 0 0 0.2rem rgba(241, 48, 103, 0.25) !important",
          },
          "&:not(:disabled)": {
            backgroundColor: "#F13067 !important",
            borderColor: "#F13067 !important",
          },
          "&:not(:disabled):hover": {
            backgroundColor: "#D12A58 !important",
            borderColor: "#D12A58 !important",
          }
        },
        ".fc-button-primary": {
          backgroundColor: "#F13067 !important",
          borderColor: "#F13067 !important",
          "&:hover": {
            backgroundColor: "#D12A58 !important",
            borderColor: "#D12A58 !important",
          },
          "&:focus": {
            boxShadow: "0 0 0 0.2rem rgba(241, 48, 103, 0.25) !important",
          }
        }
      }
    }
  },
  // Custom calendar theme section
  calendar: {
    buttons: {
      addEvent: {
        backgroundColor: "#F13067",
        borderColor: "#F13067",
        hoverBackgroundColor: "#D12A58",
        hoverBorderColor: "#D12A58",
        borderRadius: "20px",
      }
    },
    scrollbar: {
      color: "#FEC9D9" // Light pink color for scrollbars
    },
    box: {
      backgroundColor: "#FEC9D9" // Light pink color for boxes
    }
  }
});

export default theme;