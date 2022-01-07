import { useState } from "react";
import Input from "@mui/material/Input";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";

export default function VideoControls({ sendVideoUrl, playlist, setPlaylist }) {
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

  function nextVideo(event) {
    sendVideoUrl(playlist[0]);
    deleteVideo(0);
  }

  function deleteVideo(i) {
    const newList = playlist.filter((item) => item !== playlist[i]);
    setPlaylist(newList);
  }

  return (
    <Container>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          sendVideoUrl(url);
          setUrl("");
        }}
      >
        <Input
          placeholder="Media URL"
          inputProps={{
            "aria-label": "description",
          }}
          name="videourl"
          fullWidth
          onChange={handleUrlChange}
          value={url}
        />
        <Button type="submit" variant="outlined">
          Play
        </Button>
        <Button variant="outlined" onClick={nextVideo}>
          Next
        </Button>
        <Button variant="outlined" onClick={queVideo}>
          Que
        </Button>
      </form>
      <Box border={1} borderColor="primary.main">
        <List dense={true}>
          {playlist.length ? (
            playlist.map((plItem, i) => (
              <ListItem key={i}>
                <ListItemText primary={plItem} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    size="small"
                    onClick={() => deleteVideo(i)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <Typography align="center">
              Playlist is empty, que a video.
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
}
