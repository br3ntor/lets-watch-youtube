import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

// Idk if this is best here or what but I try
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";

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

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
