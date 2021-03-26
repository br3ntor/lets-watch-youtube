/**
 * I need to extract chat compoent, and rename this to whatever
 * makes sense for a container that has chat, users, video/host controls
 */

import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";

import MessageField from "./MessageField";

import { useFormFields } from "../libs/use-formFields";

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
    flexGrow: 1,
  },
}));

export default function SimpleTabs({
  connectionStatus,
  roomMessages,
  inputMessage,
  messageChanged,
  handleSendMessage,
  members,
  sendVideoUrl,
  // setVideoUrl,
}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const chatBox = useRef(null);
  const [fields, handleFieldChange] = useFormFields({ videourl: "" });

  useEffect(() => {
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  }, [roomMessages]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleVideoChange = (event, wtf) => {
    event.preventDefault();
    console.log(event);
    console.log(wtf);
    sendVideoUrl(fields.videourl);
  };

  return (
    <>
      <Paper square>
        <Tabs
          className={classes.tabs}
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab label="Chat" {...a11yProps(0)} />
          <Tab label="Members" {...a11yProps(1)} />
          <Tab label="Video" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0} className={classes.tabpanel}>
        <div className={classes.chat} ref={chatBox}>
          <Typography variant="h6" gutterBottom>
            Welcome to the chat
          </Typography>
          <Typography variant="body1" gutterBottom>
            The WebSocket is currently {connectionStatus}
          </Typography>
          {roomMessages.map((msg, i) => (
            <Typography variant="body1" gutterBottom key={i}>
              {msg}
            </Typography>
          ))}
        </div>
        <MessageField
          inputMessage={inputMessage}
          messageChanged={messageChanged}
          handleSendMessage={handleSendMessage}
        />
      </TabPanel>
      <TabPanel value={value} index={1} className={classes.tabpanel}>
        {members && members.map((m, i) => <p key={i}>{m}</p>)}
      </TabPanel>
      <TabPanel value={value} index={2} className={classes.tabpanel}>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={handleVideoChange}
        >
          <Input
            placeholder="Media URL"
            inputProps={{
              "aria-label": "description",
            }}
            id="videourl"
            fullWidth
            onChange={handleFieldChange}
            value={fields.url}
          />
        </form>
      </TabPanel>
    </>
  );
}
