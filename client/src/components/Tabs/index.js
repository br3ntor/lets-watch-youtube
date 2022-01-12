import { useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Chat from "./Chat";
import VideoControls from "./VideoControls";
import MembersList from "./Members";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
      }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
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

export default function BasicTabsCustom({
  connectionStatus,
  members,
  roomMessages,
  sendMessage,
  sendVideoUrl,
  playlist,
  setPlaylist,
  playing,
}) {
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper square>
        <Tabs
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
      <TabPanel value={value} index={0}>
        <Chat
          connectionStatus={connectionStatus}
          roomMessages={roomMessages}
          sendMessage={sendMessage}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MembersList members={members} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <VideoControls
          sendVideoUrl={sendVideoUrl}
          playlist={playlist}
          setPlaylist={setPlaylist}
          playing={playing}
        />
      </TabPanel>
    </>
  );
}
