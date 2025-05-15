import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

const FullCalendarComponent = ({ events, selectedDate, onAddEvent }) => {
    const calendarRef = useRef(null);

    useEffect(() => {
        // Navigate FullCalendar to the selected date
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(selectedDate);
        }
    }, [selectedDate]);

    return (
        <Box
            sx={{
                boxShadow: 2,
                borderRadius: 2,
                padding: 2,
                backgroundColor: "#fff",
            }}
        >
            <Typography sx={{ fontWeight: "600", fontSize: 16, mb: 2 }}>
                Lịch trình tuần - {format(selectedDate, "MMMM yyyy")}
            </Typography>
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                slotMinTime="09:00:00"
                slotMaxTime="15:00:00"
                slotDuration="01:00:00" // 1-hour slots
                slotLabelInterval="01:00" // Labels every hour
                allDaySlot={false} // Hide all-day slot
                height="auto"
                contentHeight="600px"
                headerToolbar={{
                    left: "",
                    center: "",
                    right: "addEvent",
                }}
                customButtons={{
                    addEvent: {
                        text: "+ thêm lịch",
                        click: onAddEvent,
                    },
                }}
                eventContent={(arg) => (
                    <div style={{ padding: 5, borderRadius: 5 }}>
                        {arg.event.title}
                    </div>
                )}
                slotLabelFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: false,
                    hour12: false,
                }}
                eventTimeFormat={{
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: false,
                    hour12: false,
                }}
                firstDay={1} // Start week on Monday
                locale="vi" // Vietnamese locale
                dayHeaderFormat={{ weekday: "short", day: "numeric" }} // e.g., "Mon 3/10"
                sx={{
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    "& .fc": {
                        borderRadius: "10px",
                    },
                    "& .fc-button": {
                        backgroundColor: "#ff9999",
                        borderColor: "#ff9999",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#ff6666",
                            borderColor: "#ff6666",
                        },
                    },
                    "& .fc-daygrid-day-number": {
                        color: "#000",
                    },
                    "& .fc-col-header-cell": {
                        backgroundColor: "#f9f9f9",
                    },
                }}
            />
        </Box>
    );
};

// Add prop validation
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