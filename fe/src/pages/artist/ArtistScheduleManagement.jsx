import React, { useState, useEffect, useContext } from "react";
import { Box, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import theme from "../../theme/theme";
import avatar from "../../assets/artist-banner.jpg";
import GeneralScheduleTab from "../../components/schedule-tabs/GeneralScheduleTab";
import PersonalScheduleTab from "../../components/schedule-tabs/PersonalScheduleTab";
import CanceledScheduleTab from "../../components/schedule-tabs/CanceledScheduleTab";
import HttpStatusCode from "../../constants/httpStatus";
import { AppContext } from "../../contexts/app.context";
import artistApis from "../../apis/artists.apis";
import bookingApis from "../../apis/bookings.apis";

// Constants
const TABS = { GENERAL: 0, PERSONAL: 1, CANCELED: 2 };

// Extracted styles for better maintenance
const styles = {
  container: { margin: 4 },
  title: { color: theme.palette.primary.main },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: { marginY: 4 },
};

// Tab Panel component for better code organization
function TabPanel({ value, index, children }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`schedule-tabpanel-${index}`}
      aria-labelledby={`schedule-tab-${index}`}
    >
      {value === index && children}
    </div>
  );
}

// Add PropTypes validation for TabPanel
TabPanel.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.node,
};

// Tab a11y props helper
function a11yProps(index) {
  return {
    id: `schedule-tab-${index}`,
    "aria-controls": `schedule-tabpanel-${index}`,
  };
}

export default function ArtistScheduleManagement() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS.GENERAL);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);
  const { profile } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);

  const getBookingRequests = async () => {
    const response = await bookingApis.getBookingRequests();
    if (response.status === HttpStatusCode.Ok) {
      setBookings(response.data.result);
    }
  };

  useEffect(() => {
    getBookingRequests();
  }, []);

  const getAllSchedules = async () => {
    const response = await artistApis.getAllArtistWokingSchedule(
      profile.artist_id
    );
    if (response.status === HttpStatusCode.Ok) {
      setCalendarEvents(response.data.result);
    }
  };

  useEffect(() => {
    getAllSchedules();
    setLoading(false);
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    getBookingRequests();
    setSelectedDate(newDate);
  };

  // Handle add event click
  const handleAddEvent = async () => {
    console.log("Add event clicked");
    // Implement event adding functionality
  };

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Typography variant="h1" sx={styles.title}>
          Quản lý lịch hẹn
        </Typography>
        <Box sx={styles.loadingContainer}>
          <Skeleton variant="circular" width={100} height={100} />
          <Skeleton variant="rectangular" width={310} height={60} />
          <Skeleton variant="rounded" width={310} height={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Typography variant="h1" sx={styles.title}>
        Quản lý lịch hẹn
      </Typography>

      <Box sx={styles.contentContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="schedule tabs"
        >
          <Tab label="Lịch trình chung" {...a11yProps(TABS.GENERAL)} />
          <Tab label="Lịch trình cá nhân" {...a11yProps(TABS.PERSONAL)} />
          <Tab label="Đã hủy" {...a11yProps(TABS.CANCELED)} />
        </Tabs>

        {/* General Schedule Tab */}
        <TabPanel value={activeTab} index={TABS.GENERAL}>
          <GeneralScheduleTab
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            scheduleData={bookings}
            calendarEvents={calendarEvents}
            getAllSchedules={getAllSchedules}
            onAddEvent={handleAddEvent}
          />
        </TabPanel>

        {/* Personal Schedule Tab */}
        <TabPanel value={activeTab} index={TABS.PERSONAL}>
          <PersonalScheduleTab />
        </TabPanel>

        {/* Canceled Schedule Tab */}
        <TabPanel value={activeTab} index={TABS.CANCELED}>
          <CanceledScheduleTab />
        </TabPanel>
      </Box>
    </Box>
  );
}
