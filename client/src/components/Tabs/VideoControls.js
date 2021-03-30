import { useState } from "react";
import Input from "@material-ui/core/Input";

export default function VideoControls({ sendVideoUrl }) {
  const [url, setUrl] = useState("");

  function handleUrlChange(event) {
    setUrl(event.target.value);
  }

  return (
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
    </form>
  );
}
