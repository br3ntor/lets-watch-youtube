import { useState } from "react";
import PropTypes from "prop-types";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";

import Chat from "./Chat";
import VideoControls from "./VideoControls";
import MembersList from "./Members";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box height="100%" display="flex" flexDirection="column">
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  chat: {
    margin: theme.spacing(1),
    flexGrow: 1,
    overflow: "auto",
    wordBreak: "break-all",
  },
  tabs: {
    "&  button": {
      [theme.breakpoints.up("sm")]: {
        minWidth: "125px", // This overides .MuiTab-root @media (min-width: 600px)
      },
    },
  },
  tabpanel: {
    height: `calc(100% - 48px)`,
  },
}));

export default function SimpleTabs({
  connectionStatus,
  members,
  roomMessages,
  sendMessage,
  sendVideoUrl,
  playlist,
  setPlaylist,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper square>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleTabChange}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Chat" {...a11yProps(0)} />
          <Tab label="Members" {...a11yProps(1)} />
          <Tab label="Video" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0} className={classes.tabpanel}>
        <Chat
          connectionStatus={connectionStatus}
          roomMessages={roomMessages}
          sendMessage={sendMessage}
        />
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabpanel}>
        <MembersList members={members} />
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.tabpanel}>
        <VideoControls
          sendVideoUrl={sendVideoUrl}
          playlist={playlist}
          setPlaylist={setPlaylist}
        />
      </TabPanel>
    </>
  );
}
