import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme/theme";
import { AppProvider } from "./contexts/app.context";
import { BrowserRouter } from "react-router-dom";
import SmoothScroll from "./layouts/SmoothScroll";

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppProvider>
          <CssBaseline />
            <App /> 
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>

);
