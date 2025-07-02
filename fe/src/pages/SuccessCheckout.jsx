import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import appointmentApis from "../apis/appointments.apis";

export default function SuccessCheckout() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      try {
        const response = await appointmentApis.getAppointmentById(
          appointmentId,
          "appointment"
        );
        setAppointment(response.data.result);
      } catch (error) {
        toast.error("Không thể lấy thông tin lịch hẹn.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box
        minHeight="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography color="error">
          Không tìm thấy thông tin lịch hẹn.
        </Typography>
      </Box>
    );
  }

  const {
    artist,
    client,
    service,
    start_time,
    end_time,
    booking_date,
    street_name,
    total_price,
  } = appointment;

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 3,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 2 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Đặt lịch thành công!
      </Typography>

      <Typography variant="body1" sx={{ maxWidth: 500, mb: 3 }}>
        Cảm ơn bạn đã sử dụng MKub. Lịch hẹn của bạn đã được ghi nhận.
      </Typography>

      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          padding: 3,
          width: "100%",
          maxWidth: 500,
          textAlign: "left",
          mb: 3,
        }}
      >
        <Typography fontWeight="bold" gutterBottom>
          Thông tin lịch hẹn
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={artist.avatar_url} alt={artist.name} />
          <Box>
            <Typography>
              <strong>Nghệ sĩ:</strong> {artist.name}
            </Typography>
            <Typography fontSize="0.875rem" color="gray">
              SĐT: {appointment.artist_phone}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={client.avatar_url} alt={client.first_name} />
          <Box>
            <Typography>
              <strong>Khách hàng:</strong> {client.first_name}{" "}
              {client.last_name}
            </Typography>
            <Typography fontSize="0.875rem" color="gray">
              SĐT: {appointment.client_phone}
            </Typography>
          </Box>
        </Box>

        <Typography>
          <strong>Dịch vụ:</strong> {service.service_name}
        </Typography>
        <Typography>
          <strong>Thời gian:</strong> {dayjs(booking_date).format("DD/MM/YYYY")}{" "}
          từ {dayjs(start_time).format("HH:mm")} đến{" "}
          {dayjs(end_time).format("HH:mm")}
        </Typography>
        <Typography>
          <strong>Địa điểm:</strong> {street_name}
        </Typography>
        <Typography>
          <strong>Giá:</strong> {total_price.toLocaleString()}₫
        </Typography>
      </Box>

      <Button variant="contained" onClick={handleGoHome}>
        Quay về trang chủ
      </Button>
    </Box>
  );
}
