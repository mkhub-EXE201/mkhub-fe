import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { vi } from "date-fns/locale";
import theme from "../theme/theme";

const ScheduleCalendar = ({ selectedDate, handleDateChange }) => {
    return (
        <Box
            sx={{
                boxShadow: 2,
                borderRadius: 2,
                padding: 3,
                backgroundColor: "#fff",
                width: "100%",
                height: "100%", // Ensure it takes full height
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Center vertically
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DateCalendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    views={["day"]}
                    showDaysOutsideCurrentMonth
                    displayWeekNumber={false}
                    localeText={{
                        calendarWeekNumberHeaderText: "Tuần",
                        calendarWeekNumberText: (weekNumber) => `${weekNumber}`,
                    }}
                    sx={{
                        '& .MuiPickersDay-root.Mui-selected': {
                            backgroundColor: "#F13067 !important",
                            color: "#fff !important",
                            fontWeight: "bold",
                            '&:hover, &:focus': {
                                backgroundColor: "#F13067 !important",
                            },
                            '&:not(.Mui-selected)': {
                                borderColor: "#F13067",
                            },
                        },
                        "& .MuiPickersDay-today": {
                            border: "1px solid #ccc",
                        },
                        "& .MuiDayCalendar-header": {
                            color: theme.palette.primary.main,
                        },
                        "& .MuiPickersDay-root:hover": {
                            backgroundColor: theme.palette.lightPink,
                        },
                        "& .MuiPickersCalendarHeader-label": {
                            color: theme.palette.primary.main,
                            fontWeight: "bold",
                        },
                        // Calendar buttons
                        "& .MuiButtonBase-root.MuiIconButton-root": {
                            color: theme.palette.primary.main,
                        },
                        "& .MuiPickersArrowSwitcher-root": {
                            color: theme.palette.primary.main,
                        },
                        maxWidth: "100%"
                    }}
                />
            </LocalizationProvider>
        </Box>
    );
};

// Add PropTypes validation
ScheduleCalendar.propTypes = {
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    handleDateChange: PropTypes.func.isRequired,
};

export default ScheduleCalendar;