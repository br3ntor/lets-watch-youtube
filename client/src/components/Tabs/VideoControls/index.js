import { useState } from "react";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import MediaControlCard from "./MediaControlCard";

import getVideoData from "libs/youtube";
import { useAuth } from "libs/use-auth.js";

export default function VideoControls({
  sendVideoUrl,
  playlist,
  setPlaylist,
  playing,
  playingURL,
}) {
  const { user } = useAuth();
  const { room } = useParams();

  const userIsHost = user.id.split("-").slice(-1)[0] === room;

  const [url, setUrl] = useState("");

  function handleUrlChange(event) {
    setUrl(event.target.value);
  }

  async function queVideo(event) {
    if (url) {
      const vidURL = new URL(url);
      const videoParam = vidURL.searchParams;
      const ytVidID =
        vidURL.host === "youtu.be"
          ? vidURL.pathname.slice(1)
          : videoParam.get("v");

      const vidData = await getVideoData(ytVidID);
      setPlaylist((pl) => {
        const updatedList = [...pl, { url: url, ...vidData }];

        // Also add item to localStorage playlist.
        const userID = user.id.split("-").slice(-1)[0];
        localStorage.setItem(userID, JSON.stringify(updatedList));

        return updatedList;
      });
      setUrl("");
    }
  }

  function deleteVideo(i) {
    const newList = playlist.filter((item) => item !== playlist[i]);
    setPlaylist(newList);
    // Update localStorage with newList, overwriting playlist key
    localStorage.setItem("roomPlaylist", JSON.stringify(newList));
  }

  return (
    <Container sx={{ mb: 2 }}>
      <TextField
        disabled={!userIsHost}
        id="outlined-basic"
        label="Media URL"
        variant="outlined"
        onChange={handleUrlChange}
        value={url}
        fullWidth
        margin="normal"
      />
      <Button
        disabled={!userIsHost}
        sx={{ mb: 2 }}
        variant="contained"
        onClick={queVideo}
        fullWidth
      >
        Que
      </Button>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {playlist.length ? (
          playlist.map((plItem, i) => (
            <MediaControlCard
              userIsHost={userIsHost}
              key={i}
              playVid={() => sendVideoUrl(plItem.url)}
              deleteVideo={() => deleteVideo(i)}
              isPlaying={playing && playingURL === plItem.url}
              title={plItem.items[0].snippet.title.slice(0, 50).concat("...")}
              description={plItem.items[0].snippet.description
                .slice(0, 50)
                .concat("...")}
              thumbnails={plItem.items[0].snippet.thumbnails} // Could make a func to select correct url
            />
          ))
        ) : (
          <Typography align="center">
            Playlist is empty, que a video.
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
