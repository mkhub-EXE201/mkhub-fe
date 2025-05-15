import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const FullCalendarComponent = ({ events, selectedDate, onAddEvent }) => {
    const calendarRef = useRef(null);

    useEffect(() => {
        // Navigate FullCalendar to the selected date
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(selectedDate);
        }
    }, [selectedDate]);

    // Format month with first letter capitalized
    const formatMonthCapitalized = (date) => {
        const monthStr = format(date, "MMMM yyyy", { locale: vi });
        return monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
    };

    return (
        <Box
            sx={{
                boxShadow: 2,
                borderRadius: 2,
                padding: 3,
                backgroundColor: "#fff",
            }}
        >
            <Typography sx={{ fontWeight: "600", fontSize: 18, mb: 3 }}>
                Lịch trình tuần - {formatMonthCapitalized(selectedDate)}
            </Typography>
            <FullCalendar
                ref={calendarRef}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                slotMinTime="09:00:00"
                slotMaxTime="18:00:00"
                slotDuration="01:00:00" // 1-hour slots
                slotLabelInterval="01:00" // Labels every hour
                allDaySlot={false} // Hide all-day slot
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
                eventContent={(arg) => (
                    <div style={{
                        padding: 10,
                        borderRadius: 5,
                        fontSize: '15px',
                        fontWeight: 500,
                        lineHeight: 1.3
                    }}>
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
                dayHeaderFormat={{
                    weekday: "short",
                    day: "numeric",
                    month: "numeric"
                }} // e.g., "Mon 3/10"
                sx={{
                    width: "100%",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    "& .fc": {
                        borderRadius: "10px",
                        fontFamily: "inherit",
                        fontSize: "15px"
                    },
                    "& .fc-timegrid-slot": {
                        height: "85px !important"
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
                    "& .fc-button": {
                        backgroundColor: "#F13067",
                        borderColor: "#F13067",
                        color: "#fff",
                        fontSize: "15px",
                        padding: "8px 18px",
                        "&:hover": {
                            backgroundColor: "#d42857",
                            borderColor: "#d42857",
                        },
                        "&:focus": {
                            boxShadow: "0 0 0 0.2rem rgba(241, 48, 103, 0.5)",
                        },
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