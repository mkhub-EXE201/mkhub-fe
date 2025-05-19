import React, { useEffect, useRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Box, Typography, CssBaseline } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import theme from "../theme/theme";
import { dateUtils, calendarThemeConstants } from "../utils/common_utilities";

// Constants for calendar configuration
const CALENDAR_CONFIG = {
    SLOT_MIN_TIME: calendarThemeConstants.timeSettings.slotMinTime,
    SLOT_MAX_TIME: calendarThemeConstants.timeSettings.slotMaxTime,
    SLOT_DURATION: calendarThemeConstants.timeSettings.slotDuration,
    SLOT_LABEL_INTERVAL: calendarThemeConstants.timeSettings.slotLabelInterval,
    TIME_FORMAT: calendarThemeConstants.timeFormat,
    FIRST_DAY: 1, // Monday
    LOCALE: "vi"
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
        mb: 3
    },
    calendar: {
        width: "100%",
        borderRadius: 2,
        border: "1px solid #ccc",
        "& .fc": {
            borderRadius: "10px",
            fontFamily: "inherit",
            fontSize: "15px"
        },
        "& .fc-timegrid-slot": {
            height: "110px !important"
        },
        "& .fc-timegrid-slot-lane": {
            height: "110px !important"
        },

        "& .fc-timegrid-slot.fc-timegrid-slot-minor": {
            borderTop: "0",
            borderBottom: "0"
        },
        "& .fc-timegrid-slot-minor": {
            borderStyle: "none"
        },
        "& .fc-timegrid-slot-minor .fc-timegrid-slot-lane": {
            borderTop: "0"
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
                fontSize: "16px"
            }
        },
        "& .fc-timegrid-axis": {
            padding: "0 12px",
            color: "#666",
            fontSize: "14px"
        },
        "& .fc-timegrid-slot-label": {
            fontSize: "14px"
        },
        "& .fc-timegrid-slot-label-cushion": {
            fontSize: "14px",
            fontWeight: 500
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
        fontSize: '13px',
        fontWeight: 500,
        lineHeight: 1.2
    }
};

const FullCalendarComponent = ({ events, selectedDate, onAddEvent }) => {
    const calendarRef = useRef(null);

    useEffect(() => {
        // Navigate FullCalendar to the selected date
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(selectedDate);

            // Re-apply button styles when date changes
            applyButtonStyles();
        }
    }, [selectedDate]);

    // Function to apply direct styling to buttons
    const applyButtonStyles = () => {
        setTimeout(() => {
            const addEventButton = document.querySelector('.fc-addEvent-button');
            if (addEventButton) {
                addEventButton.style.backgroundColor = theme.palette.primary.main;
                addEventButton.style.borderColor = theme.palette.primary.main;
                addEventButton.style.borderRadius = '20px';

                // Add hover event listener
                addEventButton.addEventListener('mouseover', () => {
                    addEventButton.style.backgroundColor = theme.palette.primary.dark || "#D12A58";
                    addEventButton.style.borderColor = theme.palette.primary.dark || "#D12A58";
                });

                addEventButton.addEventListener('mouseout', () => {
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
        const container = document.querySelector('.fc');
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        }

        return () => {
            observer?.disconnect();
        };
    }, []);

    // Event content renderer
    const renderEventContent = (arg) => {
        const startTime = new Date(arg.event.start).toLocaleTimeString('vi', CALENDAR_CONFIG.TIME_FORMAT);
        const endTime = arg.event.end ?
            new Date(arg.event.end).toLocaleTimeString('vi', CALENDAR_CONFIG.TIME_FORMAT) : '';

        return (
            <div style={calendarStyles.eventContent}>
                <div style={{ fontSize: '12px' }}>{startTime} - {endTime}</div>
                <div>{arg.event.title}</div>
            </div>
        );
    };

    return (
        <Box sx={calendarStyles.container}>
            <CssBaseline />
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Lịch trình tuần - {dateUtils.formatMonthCapitalized(selectedDate)}
            </Typography>
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
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
                    month: "numeric"
                }}
                sx={calendarStyles.calendar}
            />
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
};

export default FullCalendarComponent;