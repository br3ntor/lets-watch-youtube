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
              <FaceIcon />
            </ListItemIcon>
            <ListItemText primary={m} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
