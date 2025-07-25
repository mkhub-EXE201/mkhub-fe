import React, { useEffect, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  CssBaseline,
  DialogActions,
  Button,
  Dialog,
  DialogContent,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import theme from "../theme/theme";
import { dateUtils, calendarThemeConstants } from "../utils/common_utilities";
import { useState } from "react";
import { generateTimeSlots, getValidEndTimeSlots } from "../utils/utils";
import artistSchedulesApis from "../apis/artistSchedules.apis";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
import { isAxiosUnprocessableEntityError } from "../utils/errors.type";

// Constants for calendar configuration
const CALENDAR_CONFIG = {
  SLOT_MIN_TIME: calendarThemeConstants.timeSettings.slotMinTime,
  SLOT_MAX_TIME: calendarThemeConstants.timeSettings.slotMaxTime,
  SLOT_DURATION: calendarThemeConstants.timeSettings.slotDuration,
  SLOT_LABEL_INTERVAL: calendarThemeConstants.timeSettings.slotLabelInterval,
  TIME_FORMAT: calendarThemeConstants.timeFormat,
  FIRST_DAY: 1, // Monday
  LOCALE: "vi",
};

const calendarStyles = {
  container: {
    boxShadow: 2,
    borderRadius: 2,
    padding: 3,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    mb: 3,
  },
  calendar: {
    width: "100%",
    borderRadius: 2,
    border: "1px solid #ccc",
    "& .fc": {
      borderRadius: "10px",
      fontFamily: "inherit",
      fontSize: "15px",
    },
    "& .fc-timegrid-slot": {
      height: "110px !important",
    },
    "& .fc-timegrid-slot-lane": {
      height: "110px !important",
    },

    "& .fc-timegrid-slot.fc-timegrid-slot-minor": {
      borderTop: "0",
      borderBottom: "0",
    },
    "& .fc-timegrid-slot-minor": {
      borderStyle: "none",
    },
    "& .fc-timegrid-slot-minor .fc-timegrid-slot-lane": {
      borderTop: "0",
    },
    "& .fc-timegrid-cols table": {
      width: "100%",
    },
    "& .fc-col-header-cell": {
      backgroundColor: "#f9f9f9",
      padding: "15px 0",
      "& .fc-col-header-cell-cushion": {
        padding: "10px",
        color: "#333",
        fontWeight: 600,
        textDecoration: "none",
        fontSize: "16px",
      },
    },
    "& .fc-timegrid-axis": {
      padding: "0 12px",
      color: "#666",
      fontSize: "14px",
    },
    "& .fc-timegrid-slot-label": {
      fontSize: "14px",
    },
    "& .fc-timegrid-slot-label-cushion": {
      fontSize: "14px",
      fontWeight: 500,
    },
    // Button styles
    "& .fc-button": {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      color: "#fff",
      fontSize: "15px",
      padding: "8px 18px",
      "&:hover": {
        backgroundColor: theme.palette.primary.dark || "#D12A58",
        borderColor: theme.palette.primary.dark || "#D12A58",
      },
      "&:focus": {
        boxShadow: `0 0 0 0.2rem ${theme.palette.primary.main}40`,
      },
    },
    "& .fc-addEvent-button, & .fc-button-primary.fc-addEvent-button": {
      // Use the theme calendar button styles
      backgroundColor: `${theme.calendar.buttons.addEvent.backgroundColor} !important`,
      borderColor: `${theme.calendar.buttons.addEvent.borderColor} !important`,
      borderRadius: `${theme.calendar.buttons.addEvent.borderRadius} !important`,
      color: "#fff !important",
      fontSize: "15px !important",
      padding: "8px 18px !important",
      "&:hover": {
        backgroundColor: `${theme.calendar.buttons.addEvent.hoverBackgroundColor} !important`,
        borderColor: `${theme.calendar.buttons.addEvent.hoverBorderColor} !important`,
      },
    },
  },
  eventContent: {
    padding: 8,
    borderRadius: 5,
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: 1.2,
  },
};

const FullCalendarComponent = ({
  events,
  selectedDate,
  onAddEvent,
  getAllSchedules,
}) => {
  const calendarRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    start: null,
    end: null,
  });
  const [endSlots, setEndSlots] = useState([]);
  const startSlots = generateTimeSlots();
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleDateClick = (arg) => {
    const start = new Date(arg.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    setNewEvent({
      start: start.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      end: end.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });
    setEndSlots(
      getValidEndTimeSlots(
        start.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
    );
    setModalOpen(true);
  };

  const handleSaveEvent = async () => {
    const newCalendarEvent = {
      weekday: selectedDate.toLocaleDateString("en-EN", {
        weekday: "long",
      }),
      start: newEvent.start,
      end: newEvent.end,
    };

    onAddEvent(newCalendarEvent);
    try {
      const response = await artistSchedulesApis.addNewWorkingSchedule({
        day_of_week: selectedDate
          .toLocaleDateString("en-EN", {
            weekday: "long",
          })
          .toUpperCase(),
        start_time: new Date(
          selectedDate.toDateString() + " " + newEvent.start
        ).toISOString(),
        end_time: new Date(
          selectedDate.toDateString() + " " + newEvent.end
        ).toISOString(),
      });
      if (response.status === HttpStatusCode.Ok) {
        toast.success(response.data.message);
      }
      setModalOpen(false);
      setNewEvent({ start: null, end: null });
    } catch (error) {
      if (isAxiosUnprocessableEntityError(error)) {
        const fieldErrors = error.response.data.errors;
        setFormError(fieldErrors);
        Object.keys(fieldErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: fieldErrors[key],
          });
        });
      }
    }
    getAllSchedules();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(selectedDate);
        applyButtonStyles();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedDate]);

  // Function to apply direct styling to buttons
  const applyButtonStyles = () => {
    setTimeout(() => {
      const addEventButton = document.querySelector(".fc-addEvent-button");
      if (addEventButton) {
        addEventButton.style.backgroundColor = theme.palette.primary.main;
        addEventButton.style.borderColor = theme.palette.primary.main;
        addEventButton.style.borderRadius = "20px";

        // Add hover event listener
        addEventButton.addEventListener("mouseover", () => {
          addEventButton.style.backgroundColor =
            theme.palette.primary.dark || "#D12A58";
          addEventButton.style.borderColor =
            theme.palette.primary.dark || "#D12A58";
        });

        addEventButton.addEventListener("mouseout", () => {
          addEventButton.style.backgroundColor = theme.palette.primary.main;
          addEventButton.style.borderColor = theme.palette.primary.main;
        });
      }
    }, 100);
  };

  useLayoutEffect(() => {
    applyButtonStyles();

    // Re-apply styles when view changes
    const observer = new MutationObserver(applyButtonStyles);
    const container = document.querySelector(".fc");
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  // Event content renderer
  const renderEventContent = (arg) => {
    const startTime = new Date(arg.event.start).toLocaleTimeString(
      "vi",
      CALENDAR_CONFIG.TIME_FORMAT
    );
    const endTime = arg.event.end
      ? new Date(arg.event.end).toLocaleTimeString(
          "vi",
          CALENDAR_CONFIG.TIME_FORMAT
        )
      : "";

    return (
      <div style={calendarStyles.eventContent}>
        <div style={{ fontSize: "12px" }}>
          {startTime} - {endTime}
        </div>
        <div>{arg.event.title}</div>
      </div>
    );
  };

  return (
    <Box sx={calendarStyles.container}>
      <CssBaseline />
      <Typography sx={calendarStyles.title}>
        Lịch trình tuần - {dateUtils.formatMonthCapitalized(selectedDate)}
      </Typography>
      <FullCalendar
        dateClick={handleDateClick}
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events.map((schedule) => ({
          id: schedule.id,
          title: schedule.is_available ? "Available" : "Unavailable",
          start: schedule.start_time,
          end: schedule.end_time,
          backgroundColor: schedule.is_available ? "#28a745" : "#dc3545",
          extendedProps: {
            artistId: schedule.artist_id,
            dayOfWeek: schedule.day_of_week,
          },
        }))}
        slotMinTime={CALENDAR_CONFIG.SLOT_MIN_TIME}
        slotMaxTime={CALENDAR_CONFIG.SLOT_MAX_TIME}
        slotDuration={CALENDAR_CONFIG.SLOT_DURATION}
        slotLabelInterval={CALENDAR_CONFIG.SLOT_LABEL_INTERVAL}
        allDaySlot={false}
        height="auto"
        contentHeight="800px"
        headerToolbar={{
          left: "",
          center: "",
          right: "addEvent",
        }}
        customButtons={{
          addEvent: {
            text: "+ Sự kiện",
            click: onAddEvent,
          },
        }}
        eventContent={renderEventContent}
        slotLabelFormat={CALENDAR_CONFIG.TIME_FORMAT}
        eventTimeFormat={CALENDAR_CONFIG.TIME_FORMAT}
        firstDay={CALENDAR_CONFIG.FIRST_DAY}
        locale={CALENDAR_CONFIG.LOCALE}
        dayHeaderFormat={{
          weekday: "short",
          day: "numeric",
          month: "numeric",
        }}
        sx={calendarStyles.calendar}
      />
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setError(null);
          setFormError(null);
        }}
      >
        <DialogContent sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#1f1f1f"
          >
            <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
          </svg>
          <TextField
            value={selectedDate.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            disabled
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newEvent.start}
            label="startSlot"
            onChange={(event) => {
              setNewEvent({
                ...newEvent,
                start: event.target.value,
              });
            }}
          >
            {startSlots.map((item) => (
              <MenuItem value={item} key={item}>
                {item.toLocaleString()}
              </MenuItem>
            ))}
          </Select>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newEvent.end}
            label="endSlot"
            onChange={(event) => {
              setNewEvent({
                ...newEvent,
                end: event.target.value,
              });
            }}
          >
            {endSlots.map((item) => (
              <MenuItem value={item} key={item}>
                {item.toLocaleString()}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        {formError && Object.keys(formError).length > 0 && (
          <Typography color="error" padding={3}>
            {Object.values(formError).join("\n")}
          </Typography>
        )}

        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveEvent} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

FullCalendarComponent.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onAddEvent: PropTypes.func.isRequired,
  getAllSchedules: PropTypes.func.isRequired,
};

export default FullCalendarComponent;
