import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Common utilities for date formatting across components
const dateUtils = {
  /**
   * Format date to dd/MM/yyyy format
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate: (date) => {
    return format(date, "dd/MM/yyyy", { locale: vi });
  },

  /**
   * Format month and year with capitalized first letter
   * @param {Date} date - Date to format
   * @returns {string} Formatted month and year string
   */
  formatMonthCapitalized: (date) => {
    const monthStr = format(date, "MMMM yyyy", { locale: vi });
    return monthStr.charAt(0).toUpperCase() + monthStr.slice(1);
  },

  /**
   * Check if two dates are on the same day
   * @param {Date} date1 - First date
   * @param {Date} date2 - Second date
   * @returns {boolean} True if dates are on the same day
   */
  isSameDay: (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  },

  /**
   * Format time to 24-hour format (HH:mm)
   * @param {Date} date - Date to format
   * @returns {string} Formatted time string
   */
  formatTime: (date) => {
    return date.toLocaleTimeString("vi", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },
};

// Theme constants for calendar-related components
const calendarThemeConstants = {
  // Primary color for calendar highlights
  highlightColor: "#F13067",
  // Color for calendar hover states
  hoverColor: "#F13067",
  // Default calendar time settings
  timeSettings: {
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    slotDuration: "00:30:00",
    slotLabelInterval: "01:00",
  },
  // Format options for time display
  timeFormat: {
    hour: "numeric",
    minute: "2-digit",
    meridiem: false,
    hour12: false,
  },
};

export { dateUtils, calendarThemeConstants };
