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

export default function BookingCalendar({ service }) {
  const duration = service.duration;
  console.log(service, duration);
  const { id } = useParams();
  const [workingSchedules, setWorkingSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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
    if (!workingSchedules.length && !bookings.length) return;

    const eventsFromWorkingSchedule = workingSchedules.map((ws) => ({
      id: ws.id,
      title: ws.is_available ? "Rảnh" : "Không nhận",
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

      setSelectedSlot({
        id: event.id,
        start: slotStart,
        end: slotEnd,
      });

      const validTimes = generateValidStartTimes(slotStart, slotEnd, duration);
      setTimeSlots(validTimes);

      setStartTime("");
      setEndTime("");
      setOpenModal(true);
    }
  };

  const getMinMaxTime = () => {
    if (!selectedSlot) return { min: "", max: "" };

    const startDate = new Date(selectedSlot.start);
    const endDate = new Date(selectedSlot.end);

    const maxStartDate = new Date(endDate.getTime() - duration * 60000);

    const format = (date) =>
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    return {
      min: format(startDate),
      max: format(maxStartDate),
    };
  };

  const handleStartTimeChange = (e) => {
    const selected = e.target.value;
    setStartTime(selected);

    if (!selectedSlot) {
      setEndTime("");
      return;
    }

    const [hour, minute] = selected.split(":").map(Number);
    const startDate = new Date(selectedSlot.start);
    startDate.setHours(hour, minute, 0, 0);

    const endDate = new Date(startDate.getTime() + duration * 60000);
    setEndTime(formatTime(endDate));
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
      />
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
            {`${formatTime(selectedSlot?.start)} - ${formatTime(
              selectedSlot?.end
            )}`}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="start-time-label">Giờ bắt đầu</InputLabel>
            <Select
              labelId="start-time-label"
              value={startTime}
              label="Giờ bắt đầu"
              onChange={handleStartTimeChange}
            >
              {timeSlots.map((slot, index) => (
                <MenuItem key={index} value={formatTime(slot)}>
                  {formatTime(slot)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ mt: 1 }}>
            Giờ kết thúc dự kiến: {endTime || "Chưa chọn giờ bắt đầu"}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              console.log("Đặt lịch:");
              console.log("Schedule ID:", selectedSlot?.id);
              console.log("Từ:", startTime);
              console.log("Đến:", endTime);
              setOpenModal(false);
            }}
            disabled={!startTime}
          >
            Xác nhận đặt lịch
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
