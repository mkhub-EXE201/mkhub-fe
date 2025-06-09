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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận thanh toán</DialogTitle>
      <DialogContent>
        <Typography>
          <b>Dịch vụ:</b> {appointment.service.service_name}
        </Typography>
        <Typography>
          <b>Makeup artist:</b> {appointment.artist.name}
        </Typography>
        <Typography>
          <b>Thời gian:</b> {formatTime(appointment.start_time)} -{" "}
          {formatTime(appointment.end_time)} |{" "}
          {formatDate(appointment.booking_date)}
        </Typography>
        <Typography>
          <b>Địa điểm:</b> {appointment.district_name},{" "}
          {appointment.province_name}
        </Typography>
        <Typography>
          <b>Giá:</b> {formatCurrency(appointment.total_price)} VNĐ
        </Typography>
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Chọn hình thức thanh toán
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel
                value="stripe"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQGluJhW7I1NYU7jF77E-9K9I46_ib_DUNHw&s"
                      alt="Stripe"
                      width={24}
                    />
                    <Typography>Thanh toán bằng thẻ (Stripe)</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleConfirm}>
          Xác nhận & Thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}
