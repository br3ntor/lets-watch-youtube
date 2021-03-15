import React from "react";

import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "calc(100vh - 64px)",
  },
  video: {
    backgroundColor: "green",
  },
  chat: {
    backgroundColor: "purple",
    [theme.breakpoints.down("md")]: {
      // height: "70%",
      // width: "unset",
    },
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <Grid className={classes.video} item xs={12} sm={9}>
        <h1>Video</h1>
      </Grid>
      <Grid className={classes.chat} xs={12} item sm={3}>
        <h1>Chat</h1>
      </Grid>
    </Grid>
  );
}

// import React from "react";

// import { useAuth } from "../libs/use-auth.js";

// console.log("Home imported");

// export default function Home() {
//   console.log("Home rendered.");

//   const { user } = useAuth();

//   return (
//     <main id="home">
//       <h1>Home Page</h1>
//       {user ? <p>Hello {user.name}</p> : <p>I don't know you.</p>}
//     </main>
//   );
// }
