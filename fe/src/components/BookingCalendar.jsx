import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import artistApis from "../apis/artists.apis";

export default function ArtistSchedule() {
  const { id } = useParams();
  const [workingSchedules, setWorkingSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const dayOfWeekMap = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  const mockBookings = [
    {
      id: 1,
      customer_name: "Nguyễn Văn A",
      start_time: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
      end_time: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    },
    {
      id: 2,
      customer_name: "Nguyễn Văn B",
      start_time: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(),
      end_time: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workingSchedules =
          await artistApis.getAllArtistWokingSchedule(id);

        setWorkingSchedules(
          Array.isArray(workingSchedules.data.result)
            ? workingSchedules.data.result
            : []
        );
        setBookings(mockBookings);
      } catch (error) {
        console.error("Error fetching schedule or bookings", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!workingSchedules.length && !bookings.length) return;

    const now = new Date();
    const currentDay = now.getDay();

    const eventsFromWorkingSchedule = workingSchedules
      .map((ws) => {
        const dayNum = dayOfWeekMap[ws.day_of_week.toUpperCase()];
        if (dayNum === undefined) return null;

        const startTime = new Date(ws.start_time);
        const endTime = new Date(ws.end_time);

        const diffToTargetDay = dayNum - currentDay;
        const eventDate = new Date(now);
        eventDate.setDate(now.getDate() + diffToTargetDay);
        eventDate.setHours(0, 0, 0, 0);

        const startDate = new Date(eventDate);
        startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

        const endDate = new Date(eventDate);
        endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

        return {
          id: ws.id,
          title: ws.is_available ? "Rảnh" : "Không nhận",
          start: startDate,
          end: endDate,
          allDay: false,
          backgroundColor: ws.is_available ? "#4caf50" : "#d3d3d3",
          borderColor: ws.is_available ? "#4caf50" : "#d3d3d3",
          classNames: ws.is_available ? "available-event" : "blocked-event",
        };
      })
      .filter(Boolean);

    const eventsFromBookings = bookings.map((booking) => ({
      id: booking.id,
      title: "Đã được book",
      start: new Date(booking.start_time),
      end: new Date(booking.end_time),
      allDay: false,
      backgroundColor: "#ff9800",
      borderColor: "#ff9800",
    }));

    console.log("Events from working schedule:", eventsFromWorkingSchedule);

    setEvents([...eventsFromWorkingSchedule, ...eventsFromBookings]);
  }, [workingSchedules, bookings]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Lịch làm việc Artist
      </Typography>
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
      />
    </Box>
  );
}
