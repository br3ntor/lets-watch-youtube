import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import RoomCard from "./RoomCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
  },
}));

export default function RoomGrid({ rooms }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {rooms.map((r, i) => (
          <Grid item key={i} xs={12} sm={6} md={4}>
            <RoomCard
              className={classes.card}
              users={r.users}
              roomID={r.id}
              video={r.video}
              name={r.name}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
