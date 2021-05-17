import { useState } from "react";
import Input from "@material-ui/core/Input";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      margin: theme.spacing(1),
    },
    textAlign: "center",
  },
}));

export default function VideoControls({ sendVideoUrl, playlist, setPlaylist }) {
  const [url, setUrl] = useState("");
  const classes = useStyles();

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
        className={classes.form}
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
