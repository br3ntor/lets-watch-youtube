import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import RoomCard from "./RoomCard";

import { useAuth } from "../../libs/use-auth.js";
import getVideoData from "../../libs/youtube";

export default function RoomsGrid() {
  const [rooms, setRooms] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    async function getRooms() {
      try {
        const response = await fetch("/getrooms");
        const rooms = await response.json();

        // Gonna try calling yt right after to get thumbnails and attach those to room obj.
        const videoIDs = rooms.map((r) => {
          const url = new URL(r.video);

          if (url.host === "youtu.be") {
            return url.pathname.slice(1);
          }

          const videoParam = url.searchParams;
          return videoParam.get("v");
        });
        console.log(videoIDs);

        // Might be better to do this in two functions/effects/renders, like I had it originally.
        const vidData = await getVideoData(videoIDs);
        console.log(vidData);

        // Adding title and thumbnail to room objects from youtube API call
        for (let i = 0; i < vidData.items.length; i++) {
          const pic = vidData.items[i].snippet.thumbnails;
          const thumbnail =
            pic.standard?.url || pic.high?.url || pic.medium?.url;
          const vidTitle = vidData.items[i].snippet.localized.title;
          rooms[i].thumbnail = thumbnail;
          rooms[i].vidTitle = vidTitle;
        }

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
    <Grid container spacing={4}>
      {rooms &&
        rooms.map((r, i) => (
          <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
            <RoomCard
              users={r.users}
              roomID={r.id}
              video={r.video}
              name={r.name}
              imgURL={r.thumbnail}
              vidTitle={r.vidTitle}
            />
          </Grid>
        ))}
    </Grid>
  );
}
