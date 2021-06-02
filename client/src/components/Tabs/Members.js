import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FaceIcon from "@material-ui/icons/Face";

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
