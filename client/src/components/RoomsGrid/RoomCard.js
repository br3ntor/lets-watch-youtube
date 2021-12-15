import { Link } from "react-router-dom";

import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  link: {
    textDecoration: "none",
  },
  media: {
    height: 140,
  },
});

export default function RoomCard({
  roomID,
  users,
  video,
  name,
  imgURL,
  vidTitle,
}) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.media} image={imgURL} title={vidTitle} />
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography className={classes.pos}>{users.length} watching</Typography>
        <Typography variant="body2" component="p">
          {vidTitle}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/room/${roomID}`} className={classes.link}>
          <Button size="small">Join Room</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
