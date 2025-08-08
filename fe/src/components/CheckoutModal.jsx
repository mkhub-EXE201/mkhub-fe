/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Divider,
  Paper,
} from "@mui/material";
import { formatCurrency, formatDate, formatTime } from "../utils/utils";

export default function CheckoutModal({
  open,
  onClose,
  appointment,
  onConfirm,
}) {
  if (!appointment) return null;

  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const handleConfirm = () => {
    onConfirm(paymentMethod);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          py: 2,
        }}
      >
        Xác nhận thanh toán
      </DialogTitle>

      {/* Nội dung */}
      <DialogContent sx={{ p: 3 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="body1" gutterBottom>
            <b>Dịch vụ:</b> {appointment.service.service_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Makeup artist:</b> {appointment.artist.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Thời gian:</b> {formatTime(appointment.start_time)} -{" "}
            {formatTime(appointment.end_time)} |{" "}
            {formatDate(appointment.booking_date)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Địa điểm:</b> {appointment.district_name},{" "}
            {appointment.province_name}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatCurrency(appointment.total_price)} VNĐ
          </Typography>
        </Paper>

        {/* Chọn phương thức thanh toán */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Chọn hình thức thanh toán
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="stripe"
                control={<Radio color="primary" />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGluJhW7I1NYU7jF77E-9K9I46_ib_DUNHw&s"
                      alt="Stripe"
                      width={28}
                      height={28}
                      style={{ borderRadius: "4px" }}
                    />
                    <Typography>Thanh toán bằng thẻ (Stripe)</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: "bold",
          }}
        >
          Xác nhận & Thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}
