import { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import MediaControlCard from "./MediaControlCard";

import getVideoData from "libs/youtube";

export default function VideoControls({
  sendVideoUrl,
  playlist,
  setPlaylist,
  playing,
  playingURL,
}) {
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
      setPlaylist((pl) => [...pl, { url: url, ...vidData }]);
      setUrl("");
    }
  }

  function deleteVideo(i) {
    const newList = playlist.filter((item) => item !== playlist[i]);
    setPlaylist(newList);
  }

  return (
    <Container sx={{ mb: 2 }}>
      <TextField
        id="outlined-basic"
        label="Media URL"
        variant="outlined"
        onChange={handleUrlChange}
        value={url}
        fullWidth
        margin="normal"
      />
      <Button sx={{ mb: 2 }} variant="contained" onClick={queVideo} fullWidth>
        Que
      </Button>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2}>
        {playlist.length ? (
          playlist.map((plItem, i) => (
            <MediaControlCard
              key={i}
              playVid={() => sendVideoUrl(plItem.url)}
              deleteVideo={() => deleteVideo(i)}
              playing={playing && playingURL === plItem.url}
              title={plItem.items[0].snippet.title.slice(0, 50).concat("...")}
              description={plItem.items[0].snippet.description
                .slice(0, 50)
                .concat("...")}
              thumbnail={plItem.items[0].snippet.thumbnails.standard.url} // Could make a func to select correct url
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
