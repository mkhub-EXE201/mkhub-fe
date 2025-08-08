import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Paper,
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
        p: 3,
      }}
    >
      {/* Icon thành công */}
      <CheckCircleIcon sx={{ fontSize: 90, color: "success.main", mb: 2 }} />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Đặt lịch thành công!
      </Typography>
      <Typography
        variant="body1"
        sx={{ maxWidth: 520, mb: 4, color: "text.secondary" }}
      >
        Cảm ơn bạn đã tin tưởng MKub. Lịch hẹn đã được ghi nhận, chúng tôi sẽ
        sớm liên hệ để xác nhận chi tiết.
      </Typography>

      {/* Card thông tin lịch hẹn */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          p: 3,
          width: "100%",
          maxWidth: 520,
          mb: 4,
        }}
      >
        <Typography fontWeight="bold" gutterBottom>
          Thông tin lịch hẹn
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Artist */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={artist.avatar_url}
            alt={artist.name}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography>
              <strong>Nghệ sĩ:</strong> {artist.name}
            </Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              SĐT: {appointment.artist_phone}
            </Typography>
          </Box>
        </Box>

        {/* Client */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={client.avatar_url}
            alt={client.first_name}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography>
              <strong>Khách hàng:</strong> {client.first_name}{" "}
              {client.last_name}
            </Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
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
        <Typography color="primary" fontWeight="bold" mt={1}>
          Giá: {total_price.toLocaleString()}₫
        </Typography>
      </Paper>

      <Button
        variant="contained"
        size="large"
        onClick={handleGoHome}
        sx={{
          borderRadius: 3,
          px: 4,
          fontWeight: "bold",
        }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
}
