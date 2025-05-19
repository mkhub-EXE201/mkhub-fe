import React from "react";
import { Box, Typography, useMediaQuery, Divider } from "@mui/material";
import PropTypes from "prop-types";
import ScheduleCalendar from "../ScheduleCalendar";
import ScheduleCard from "../ScheduleCard";
import FullCalendarComponent from "../FullCalendar";
import { dateUtils } from "../../utils/common_utilities";

const styles = {
    tabContent: { display: "flex", flexDirection: "column", gap: 3, marginTop: 3 },
    scheduleCardsContainer: (isLaptop) => ({
        boxShadow: 2,
        width: isLaptop ? "100%" : "50%",
        height: isLaptop ? "500px" : "100%",
        padding: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
    }),
    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 3,
        flexGrow: 1,
        overflowY: "auto",
        paddingRight: 1,
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: "10px",
        },
    },
    calendarContainer: (isLaptop) => ({
        width: isLaptop ? "100%" : "50%",
        height: isLaptop ? "500px" : "100%",
    }),
    dailyViewContainer: (isLaptop) => ({
        display: "flex",
        flexDirection: isLaptop ? "column" : "row",
        gap: 3,
        height: isLaptop ? "auto" : "500px",
    }),
};

function GeneralScheduleTab({ selectedDate, handleDateChange, scheduleData, calendarEvents, onAddEvent }) {
    const isLaptop = useMediaQuery('(max-width:1024px)');

    // Filter schedule data based on selected date
    const filteredSchedule = scheduleData.filter((item) =>
        dateUtils.isSameDay(item.fullDate, selectedDate)
    );

    return (
        <Box sx={styles.tabContent}>
            {/* Daily View: Schedule Cards and Calendar */}
            <Box sx={styles.dailyViewContainer(isLaptop)}>
                {/* Schedule Cards Section (LEFT SIDE) */}
                <Box sx={styles.scheduleCardsContainer(isLaptop)}>
                    <Typography sx={{ fontWeight: "600", fontSize: 16, mb: 2 }}>
                        Lịch hẹn - {dateUtils.formatDate(selectedDate)}
                    </Typography>

                    {filteredSchedule.length > 0 ? (
                        <Box sx={styles.cardsGrid}>
                            {filteredSchedule.map((appointment) => (
                                <ScheduleCard
                                    key={appointment.id}
                                    appointment={appointment}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Typography sx={{ marginTop: 2 }}>
                            Không có lịch hẹn cho ngày này.
                        </Typography>
                    )}
                </Box>

                {/* Calendar Section (RIGHT SIDE) */}
                <Box sx={styles.calendarContainer(isLaptop)}>
                    <ScheduleCalendar
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                    />
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Weekly View: FullCalendar */}
            <Box>
                <FullCalendarComponent
                    events={calendarEvents}
                    selectedDate={selectedDate}
                    onAddEvent={onAddEvent}
                />
            </Box>
        </Box>
    );
}

GeneralScheduleTab.propTypes = {
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    handleDateChange: PropTypes.func.isRequired,
    scheduleData: PropTypes.array.isRequired,
    calendarEvents: PropTypes.array.isRequired,
    onAddEvent: PropTypes.func.isRequired
};

export default GeneralScheduleTab;