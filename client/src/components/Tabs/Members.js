import makeStyles from '@mui/styles/makeStyles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FaceIcon from "@mui/icons-material/Face";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function SimpleList({ members }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List>
        {members.map((m, i) => (
          <ListItem key={i}>
            <ListItemIcon>
              <FaceIcon
                // Hmm is it better to use react-router's history hook here? I don't know!
                color={
                  window.location.pathname.includes(
                    m.id.split("-").slice(-1)[0]
                  )
                    ? "primary"
                    : ""
                }
              />
            </ListItemIcon>
            <ListItemText primary={m.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
