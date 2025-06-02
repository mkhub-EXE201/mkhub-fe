/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import {
  Box,
  Button,
  Modal,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useParams } from "react-router-dom";
import artistApis from "../apis/artists.apis";

export default function BookingCalendar({
  register,
  setValue,
  trigger,
  errors,
  service,
  bookingSchedule,
  setBookingSchedule,
  bookingStartTime,
  bookingEndTime,
  setBookingStartTime,
  setBookingEndTime,
}) {
  const duration = service.duration;
  const { id } = useParams();
  const [workingSchedules, setWorkingSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workingSchedulesRes =
          await artistApis.getAllArtistWokingSchedule(id);
        const scheduleData = workingSchedulesRes?.data?.result || [];
        setWorkingSchedules(scheduleData);

        // Mock bookings
        const mockBookings = [
          {
            id: 1,
            customer_name: "Nguyễn Văn A",
            start_time: "2025-06-01T08:30:00.000Z",
            end_time: "2025-06-01T11:00:00.000Z",
          },
          {
            id: 2,
            customer_name: "Nguyễn Văn B",
            start_time: "2025-06-01T14:00:00.000Z",
            end_time: "2025-06-01T16:30:00.000Z",
          },
        ];
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error fetching schedule or bookings", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    register("bookingSchedule", { required: "Bạn cần chọn lịch" });
    register("bookingStartTime", { required: "Bạn cần chọn giờ bắt đầu" });
    register("bookingEndTime", { required: "Bạn cần chọn giờ kết thúc" });
  }, [register]);

  useEffect(() => {
    if (bookingSchedule) setValue("bookingSchedule", bookingSchedule);
  }, [bookingSchedule, setValue]);

  useEffect(() => {
    if (bookingStartTime) setValue("bookingStartTime", bookingStartTime);
  }, [bookingStartTime, setValue]);

  useEffect(() => {
    if (bookingEndTime) setValue("bookingEndTime", bookingEndTime);
  }, [bookingEndTime, setValue]);

  useEffect(() => {
    if (!workingSchedules.length && !bookings.length) return;

    const eventsFromWorkingSchedule = workingSchedules.map((ws) => ({
      id: ws.id,
      title: ws.is_available ? "Trống" : "Không nhận",
      start: new Date(ws.start_time),
      end: new Date(ws.end_time),
      allDay: false,
      backgroundColor: ws.is_available ? "#4caf50" : "#d3d3d3",
      borderColor: ws.is_available ? "#4caf50" : "#d3d3d3",
      classNames: ws.is_available ? "available-event" : "blocked-event",
    }));

    const eventsFromBookings = bookings.map((booking) => ({
      id: booking.id,
      title: "Đã được book",
      start: new Date(booking.start_time),
      end: new Date(booking.end_time),
      allDay: false,
      backgroundColor: "#ff9800",
      borderColor: "#ff9800",
    }));

    setEvents([...eventsFromWorkingSchedule, ...eventsFromBookings]);
  }, [workingSchedules, bookings]);
  const formatTime = (time) => {
    const date = typeof time === "string" ? new Date(time) : time;
    if (!date || isNaN(date)) return "";
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const generateValidStartTimes = (slotStart, slotEnd, duration, step = 30) => {
    const times = [];
    const start = new Date(slotStart);
    const end = new Date(slotEnd);
    const latestStart = new Date(end.getTime() - duration * 60000);

    const current = new Date(start);
    while (current <= latestStart) {
      times.push(new Date(current));
      current.setMinutes(current.getMinutes() + step);
    }

    return times;
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    if (event.classNames.includes("available-event")) {
      const slotStart = event.start;
      const slotEnd = event.end;

      setBookingSchedule({
        id: event.id,
        start: slotStart,
        end: slotEnd,
      });

      const validTimes = generateValidStartTimes(slotStart, slotEnd, duration);
      setTimeSlots(validTimes);

      setBookingStartTime("");
      setBookingEndTime("");
      setOpenModal(true);
    }
  };

  const handleStartTimeChange = (e) => {
    const selected = e.target.value;
    setBookingStartTime(selected);

    if (!bookingSchedule) {
      setBookingEndTime("");
      return;
    }

    const [hour, minute] = selected.split(":").map(Number);
    const startDate = new Date(bookingSchedule.start);
    startDate.setHours(hour, minute, 0, 0);

    const endDate = new Date(startDate.getTime() + duration * 60000);
    setBookingEndTime(formatTime(endDate));
  };

  return (
    <Box sx={{ p: 2 }}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={viLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        allDaySlot={false}
        slotMinTime="00:00:00"
        slotMaxTime="23:59:59"
        slotDuration="00:30:00"
        events={events}
        height="auto"
        nowIndicator={true}
        selectable={false}
        eventClick={handleEventClick}
      />{" "}
      {errors.bookingSchedule && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {errors.bookingSchedule.message}
        </Typography>
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "#fff",
            width: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chọn giờ bắt đầu trong khoảng:
          </Typography>
          <Typography gutterBottom>
            {`${formatTime(bookingSchedule?.start)} - ${formatTime(
              bookingSchedule?.end
            )}`}
          </Typography>
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.bookingStartTime}
          >
            <InputLabel id="start-time-label">Giờ bắt đầu</InputLabel>
            <Select
              labelId="start-time-label"
              value={bookingStartTime}
              label="Giờ bắt đầu"
              onChange={handleStartTimeChange}
            >
              {timeSlots.map((slot, idx) => (
                <MenuItem key={idx} value={formatTime(slot)}>
                  {formatTime(slot)}
                </MenuItem>
              ))}
            </Select>
            {errors.bookingStartTime && (
              <Typography variant="caption" color="error">
                {errors.bookingStartTime.message}
              </Typography>
            )}
          </FormControl>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Giờ kết thúc dự kiến: {bookingEndTime || "Chưa chọn giờ bắt đầu"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={async () => {
              const valid = await trigger([
                "bookingSchedule",
                "bookingStartTime",
                "bookingEndTime",
              ]);
              if (valid) setOpenModal(false);
            }}
            disabled={!bookingStartTime}
          >
            Xác nhận đặt lịch
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
