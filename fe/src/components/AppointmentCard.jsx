/* eslint-disable react/prop-types */
import React from "react";
import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import { formatDate, formatTime } from "../utils/utils";
import { APPOINTMENT_STATUS } from "../constants/enum";
const AppointmentCard = ({ appointment, onViewDetail, onCheckout }) => {
  return (
    <Card onClick={onViewDetail} sx={{ mb: 2, p: 2, cursor: "pointer" }}>
      {/* Artist Info */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Avatar src={appointment.artist.avatar_url} />
        <Box>
          <Typography fontWeight="bold">
            Artist {appointment.artist.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SĐT: {appointment.artist_phone}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* Service Info */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          component="img"
          src={appointment.service.thumbnail}
          sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 2 }}
        />
        <Box>
          <Typography variant="body1" fontWeight="medium">
            {appointment.service.service_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(appointment.booking_date)} |{" "}
            {formatTime(appointment.start_time)} -{" "}
            {formatTime(appointment.end_time)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.street_name}, {appointment.ward_name},{" "}
            {appointment.district_name}, {appointment.province_name}
          </Typography>
        </Box>
      </Box>
      {/* Extra Info */}
      <Box mt={2}>
        <Typography variant="body2">
          Ghi chú: {appointment.client_note || "Không có"}
        </Typography>
        <Typography variant="subtitle1" mt={1}>
          Tổng tiền: {appointment.total_price.toLocaleString("vi-VN")}₫
        </Typography>
      </Box>
      {/* Checkout Button */}
      {appointment?.appointmentStatusLog?.at(-1) ===
        APPOINTMENT_STATUS.CONFIRMED && (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            onCheckout();
          }}
        >
          Thanh toán
        </Button>
      )}
    </Card>
  );
};

export default AppointmentCard;
