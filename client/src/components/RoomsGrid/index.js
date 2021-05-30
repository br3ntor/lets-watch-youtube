import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import RoomCard from "./RoomCard";
import { useAuth } from "../../libs/use-auth.js";

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

export default function RoomsGrid() {
  const [rooms, setRooms] = useState(false);
  const { user, setUser } = useAuth();

  const classes = useStyles();

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await fetch("/getrooms");
        const rooms = await response.json();
        setRooms(rooms);
      } catch (e) {
        console.error(e);
      }
    }
    getRooms();
  }, []);

  // TL;DR Gets rooms, checks if room for user is there if user is signed in, adds to obj if room exists
  // This adds the room to the auth user obj if the room exists but is not on the user obj
  // Which is the case on a refresh. When the room is first created, the roomid is added to the user obj on the client
  // On refresh though auth obj is populated from db, but rooms aren't persisted, they are just stored in an object in memory.
  useEffect(() => {
    if (user && !user.hasOwnProperty("room") && rooms) {
      const usersRoom = user.id.split("-").slice(-1)[0];
      const foundRoom = rooms.filter((r) => r.id === usersRoom);

      if (foundRoom.length !== 0) {
        console.log("User room already created", foundRoom);
        setUser((prev) => {
          return { ...prev, room: foundRoom[0].id };
        });
      } else {
        console.log("User room not created.");
      }
    }
  }, [rooms, user, setUser]);

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {rooms &&
          rooms.map((r, i) => (
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
