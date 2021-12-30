// import React from "react";
import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";

import AppBar from "./components/AppBar";
import MyRoutes from "./MyRoutes";

import { ProvideAuth } from "./libs/use-auth.js";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

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
