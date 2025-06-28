/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CardContent,
  Divider,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PropTypes from "prop-types";
import { formatFullDateTimeRange } from "../../utils/utils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import locationApi from "../../apis/locations.apis";
const styles = {
  card: {
    borderRadius: "18px",
    // boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease",
    minHeight: 200,
  },
  tabContainer: {
    width: "100%",
    marginTop: 8,
    display: "flex",
  },
  tabsRoot: {
    minWidth: "120px",
  },
  tab: {
    backgroundColor: "#F13067",
    color: "white",
    borderRadius: "20px 0 0 20px",
    minHeight: 60,
    // marginRight: 5,
    marginLeft: 1,
    marginTop: 3.5,
    width: "95%",
    maxWidth: "95%",
    textTransform: "none",
    fontWeight: 600,
    alignItems: "flex-start",
    marginBottom: 0,
    position: "relative",
    transition: "all 0.3s",
    "&.Mui-selected": {
      backgroundColor: "#F13067",
      color: "white",
      borderLeft: "0px solid #FF69B4",
      backgroundImage:
        "linear-gradient(to right, rgba(255,105,180,0.3), rgba(255,105,180,0))",
      animation: "$glow 1.5s infinite ease-in-out",
      // boxShadow: "0 0 5px rgba(241, 48, 103, 0.7)",
    },
    "&:not(.Mui-selected)": {
      opacity: 0.6,
      filter: "brightness(1)",
      "&:hover": {
        transform: "scale(1.05)",
        opacity: 1,
      },
    },
  },

  "@keyframes glow": {
    "0%": { boxShadow: "0 0 5px rgba(241, 48, 103, 0.5)" },
    "50%": { boxShadow: "0 0 15px rgba(241, 48, 103, 0.8)" },
    "100%": { boxShadow: "0 0 5px rgba(241, 48, 103, 0.5)" },
  },
  tabPanel: {
    //content
    padding: 4,
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    minHeight: 300,
    maxWidth: 700,
    flexGrow: 1, // Allow panel to take remaining space
    boxShadow: "0 2px 8px rgb(232, 137, 185)",
    transition: "box-shadow 0.3s ease",
    // marginLeft: 0,
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
  },
  tabContent: {
    width: "100%",
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={styles.tabPanel}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function PersonalScheduleDetailsTabs({
  appointment,
  wardName,
  districtName,
  provinceName,
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={styles.tabContainer}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="personal schedule details tabs"
        sx={{
          ...styles.tabsRoot,
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab label="Dịch vụ" sx={styles.tab} />
        <Tab label="Lịch hẹn" sx={styles.tab} />
        <Tab label="Ghi chú" sx={styles.tab} />
      </Tabs>
      <Box sx={styles.tabContent}>
        <TabPanel value={value} index={0}>
          {/* <Card sx={styles.card}> */}
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {appointment.service.service_name}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>{appointment.service.description} </Typography>
          </CardContent>
          {/* </Card> */}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 0, fontWeight: 600 }}>
              {formatFullDateTimeRange(
                appointment.start_time,
                appointment.end_time
              )}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon />
              <Typography>{appointment.service.duration} phút</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlaceIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />
              <Typography>
                {appointment.street_name}, {wardName}, {districtName},{" "}
                {provinceName}
              </Typography>
            </Box>
          </CardContent>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <CardContent>
            <Typography sx={{ fontSize: "1rem" }}>
              {appointment.client_note || "Không có."}
            </Typography>
          </CardContent>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default PersonalScheduleDetailsTabs;
