import { useState } from "react";
import Input from "@material-ui/core/Input";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      margin: theme.spacing(1),
    },
    textAlign: "center",
  },
}));

export default function VideoControls({ sendVideoUrl }) {
  const [url, setUrl] = useState("");
  const classes = useStyles();

  function handleUrlChange(event) {
    setUrl(event.target.value);
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
        <Button type="submit" variant="outlined" color="default">
          Play Video
        </Button>
        <Button variant="outlined" color="primary">
          Add to Que
        </Button>
      </form>
    </Container>
  );
}
