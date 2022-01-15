import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function MediaControlCard({
  playVid,
  deleteVideo,
  playing: isPlaying,
  title,
  description,
  thumbnail,
}) {
  return (
    <Card>
      <CardMedia image={thumbnail} component="img" height="140" />
      <CardContent sx={{ pt: 1.5, pb: 0 }}>
        <Typography sx={{ fontSize: "1.1rem" }} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" component="div" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <IconButton aria-label="play/pause" onClick={playVid}>
          {isPlaying ? (
            <PauseIcon sx={{ height: 38, width: 38 }} />
          ) : (
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          )}
        </IconButton>
        <IconButton aria-label="delete" onClick={deleteVideo}>
          <DeleteOutlineIcon sx={{ height: 38, width: 38 }} color="#f44336" />
        </IconButton>
      </CardActions>
    </Card>
  );
}
