import { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import MediaControlCard from "./MediaControlCard";

export default function VideoControls({
  sendVideoUrl,
  playlist,
  setPlaylist,
  playing,
}) {
  const [url, setUrl] = useState("");

  function handleUrlChange(event) {
    setUrl(event.target.value);
  }

  function queVideo(event) {
    if (url) {
      setPlaylist((pl) => [...pl, url]);
      setUrl("");
    }
  }

  function deleteVideo(i) {
    const newList = playlist.filter((item) => item !== playlist[i]);
    setPlaylist(newList);
  }

  return (
    <Container>
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
      <Stack spacing={1}>
        {playlist.length ? (
          playlist.map((plItem, i) => (
            <MediaControlCard
              key={i}
              playVid={() => sendVideoUrl(plItem)}
              deleteVideo={() => deleteVideo(i)}
              playing={playing}
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
