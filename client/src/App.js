import React from "react";
import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from "@mui/material/styles";
import MyRoutes from "./MyRoutes";

import AppBar from "./components/AppBar";
import { ProvideAuth } from "./libs/use-auth.js";

import { teal } from '@mui/material/colors';

const darkTheme = createTheme(adaptV4Theme({
  palette: {
    mode: "dark",
    primary: {
      main: teal[500],
    },
    secondary: {
      main: "#f44336",
    },
  },
}));

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ProvideAuth>
          <BrowserRouter>
            <AppBar />
            <MyRoutes />
          </BrowserRouter>
        </ProvideAuth>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
