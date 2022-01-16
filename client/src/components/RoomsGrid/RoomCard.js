import { Link as RouterLink } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

export default function RoomCard({
  roomID,
  users,
  video,
  name,
  imgURL,
  vidTitle,
}) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardMedia component="img" height="140" image={imgURL} title={vidTitle} />
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography gutterBottom>
          <Typography
            component="span"
            color={users.length ? "success.main" : ""}
          >
            {users.length}{" "}
          </Typography>
          watching
        </Typography>
        <Typography variant="body2" component="p">
          {vidTitle}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/room/${roomID}`} size="small">
          Join Room
        </Button>
      </CardActions>
    </Card>
  );
}
