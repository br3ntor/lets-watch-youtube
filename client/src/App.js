import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";

import Routes from "./Routes";
import AppBar from "./components/AppBar";

import { ProvideAuth } from "./libs/use-auth.js";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: teal[500],
    },
    secondary: {
      main: "#f44336",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ProvideAuth>
        <Router>
          <AppBar />
          <Routes />
        </Router>
      </ProvideAuth>
    </ThemeProvider>
  );
}
