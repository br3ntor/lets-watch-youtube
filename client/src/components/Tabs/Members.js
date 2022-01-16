import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FaceIcon from "@mui/icons-material/Face";

export default function SimpleList({ members }) {
  return (
    <List>
      {members.map((m, i) => (
        <ListItem key={i}>
          <ListItemButton>
            <ListItemIcon>
              <FaceIcon
                // Hmm is it better to use react-router's history hook here? I don't know!
                // FIX: The fix I'm thinking might be part of the larger system of state objects.
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
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
