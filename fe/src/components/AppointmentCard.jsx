/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { formatDate, formatTime } from "../utils/utils";
import { APPOINTMENT_STATUS } from "../constants/enum";
import feedbackApis from "../apis/feedbacks.apis";
import { HttpStatusCode } from "axios";
import FeedbackRating from "./FeedbackRating";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addFeedbackSchema } from "../schemas/addFeedbackSchema";
import toast from "react-hot-toast";
import { isAxiosUnprocessableEntityError } from "../utils/errors.type";

const AppointmentCard = ({ appointment, onViewDetail, onCheckout }) => {
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const {
    register,
    setError,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(addFeedbackSchema),
    defaultValues: {
      appointment_id: appointment.id,
      content: "",
      rating_star: 4,
    },
  });

  const handleFeedback = handleSubmit(async () => {
    try {
      const response = await feedbackApis.feedback({
        appointment_id: watch("appointment_id"),
        content: watch("content"),
        rating_star: watch("rating_star"),
      });
      if (response.status === HttpStatusCode.Ok) {
        setFeedback(null);
        reset();
        setOpenFeedbackModal(false);
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      if (isAxiosUnprocessableEntityError(error)) {
        const formError = error.response.data.errors;
        Object.keys(formError).forEach((key) => {
          setError(key, {
            type: "Server",
            message: formError[key],
          });
        });
      }
    }
  });

  const getFeedback = async () => {
    const response = await feedbackApis.getFeedback(
      "appointment",
      appointment.id
    );
    if (
      response.status === HttpStatusCode.Ok &&
      response.data.result !== null
    ) {
      setFeedback(response.data.result);
    }
  };

  useEffect(() => {
    getFeedback();
  }, []);

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
      {/* Feedback Button */}
      {appointment?.appointmentStatusLog?.at(-1) ===
        APPOINTMENT_STATUS.COMPLETED &&
        !feedback && (
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFeedbackModal(true);
            }}
          >
            Đánh giá
          </Button>
        )}
      <Box onClick={(e) => e.stopPropagation()}>
        <Modal
          open={openFeedbackModal}
          onClose={() => setOpenFeedbackModal(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              minWidth: 600,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Đánh giá dịch vụ
              </Typography>
              <CancelIcon
                style={{ width: 40, height: 40 }}
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  ":hover": {
                    opacity: "60%",
                  },
                }}
              />
            </Box>
            <Divider sx={{ my: 2, mx: -4 }} />
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <FeedbackRating
                value={watch("rating_star")}
                setValue={(value) => setValue("rating_star", value)}
              />
            </Box>
            <Typography sx={{ mt: 5, mb: 3, fontSize: 14, color: "gray" }}>
              Cảm ơn bạn đã sử dụng dịch vụ! Hãy chia sẻ cảm nhận của bạn để
              chúng mình không ngừng hoàn thiện và mang đến trải nghiệm tốt
              hơn^^
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              label="Nội dung đánh giá"
              {...register("content")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message || " "}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="outlined" sx={{ marginY: 2 }}>
                Hủy
              </Button>
              <Button
                variant="contained"
                sx={{ marginY: 2 }}
                type="submit"
                onClick={handleFeedback}
              >
                Gửi đánh giá
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Card>
  );
};

export default AppointmentCard;
