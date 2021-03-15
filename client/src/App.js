import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";

import Routes from "./Routes";
import AppBar from "./components/AppBar";

import { ProvideAuth } from "./libs/use-auth.js";

const useStyles = makeStyles((theme) => ({
  main: {
    // display: "flex",
    // flexDirection: "column",
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <CssBaseline />
      <ProvideAuth>
        <AppBar />
        <Routes />
      </ProvideAuth>
    </div>
  );
}

// TODO: Figure how how to send this down through all routes,
// that is, unless I use the hooks I guess? I wonder how I can
// pass those around...hmmm
// export default withRouter(App);
