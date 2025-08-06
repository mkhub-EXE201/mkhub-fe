/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import userApis from "../apis/users.apis";
import HttpStatusCode from "../constants/httpStatus";
import { BOOKING_ADDRESS_TYPE, BOOKING_STATUS } from "../constants/enum";
import { formatCurrency, formatTime, getStatusColor } from "../utils/utils";
import locationApi from "../apis/locations.apis";
import { formatDate } from "date-fns";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { verifyBookingSchema } from "../schemas/verifyBookingSchema";
import bookingApis from "../apis/bookings.apis";
import toast from "react-hot-toast";

// Common styles extracted for better maintenance
const styles = {
  avatar: {
    borderRadius: "50%",
    width: 50,
    height: 50,
    objectFit: "cover",
  },
  service: {
    fontSize: 14,
  },
  dateTime: {
    fontSize: 12,
    color: "#666",
  },
};

const ScheduleCard = ({
  appointment,
  getBookingRequests,
  onClickGoToPersonalTab,
}) => {
  const [client, setClient] = useState({});
  const [location, setLocation] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyBookingSchema),
    defaultValues: {
      verify_status: "",
      reason: "",
    },
  });
  useEffect(() => {
    const getClientInfo = async () => {
      const response = await userApis.getUser(appointment.client_id);
      if (response.status === HttpStatusCode.Ok) {
        setClient(response.data.result);
      }
    };
    getClientInfo();
  }, [appointment.client_id]);

  const handleSubmit = async () => {
    const response = await bookingApis.verifyBookingRequest(appointment.id, {
      status: watch("verify_status"),
      reason: watch("reason"),
    });
    if (response.status === HttpStatusCode.Ok) {
      toast.success(response.data.message);
      setOpenModal(false);
      getBookingRequests();
    }
  };
  const handleClick = async () => {
    onClickGoToPersonalTab();
    if (appointment.status === BOOKING_STATUS.PENDING) {
      const [ward, district, province] = await Promise.all([
        locationApi.getWardNameByCode(
          appointment.ward_code,
          appointment.district_id
        ),
        locationApi.getDistrictNameByCode(
          appointment.district_id,
          appointment.province_id
        ),
        locationApi.getProvinceNameByCode(appointment.province_id),
      ]);
      setLocation(
        `${appointment.street_name}, ${ward.data.result}, ${district.data.result}, ${province.data.result}`
      );
      setOpenModal(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 2,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#fff",
          ":hover": {
            cursor: "pointer",
          },
        }}
        onClick={() => handleClick()}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src={client.avatar_url}
            alt={`Khach Hang ${client.last_name} ${client.first_name}`}
            style={styles.avatar}
          />
          <Box>
            <Typography fontWeight={500}>
              {`Khách hàng ${client.last_name} ${client.first_name}`}
            </Typography>
            <Box sx={{ display: "flex", gap: "5px" }}>
              <PlaceIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 13 }}>
                {appointment.address_type ===
                BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS
                  ? "Tại studio của tôi"
                  : "Tại địa chỉ của khách hàng"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography sx={styles.service}>
              {appointment.service_name}
            </Typography>
            <Typography sx={styles.dateTime}>
              {formatTime(appointment.start_time)} -{" "}
              {formatTime(appointment.end_time)}
            </Typography>
          </Box>
          <Chip
            sx={{
              backgroundColor: getStatusColor(appointment.status),
              padding: "2px 8px",
              borderRadius: "12px",
              fontSize: 12,
              fontWeight: 500,
              textTransform: "capitalize",
              width: "fit-content",
            }}
            label={
              appointment.status === BOOKING_STATUS.APPROVED
                ? "Đã duyệt"
                : appointment.status === BOOKING_STATUS.PENDING
                  ? "Chờ duyệt"
                  : "Đã từ chối"
            }
          />
        </Box>
      </Box>

      {/* MODAL */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài làm mở lại
          sx={{
            p: 3,
            backgroundColor: "#fff",
            width: 800,
            maxHeight: "80vh",
            overflowY: "auto",
            mx: "auto",
            mt: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 2,
          }}
        >
          {/* Các TextField như cũ */}
          <Typography variant="h5" gutterBottom>
            Thông tin buổi Makeup
          </Typography>
          <TextField
            fullWidth
            label="Tên khách hàng"
            variant="outlined"
            value={`${client.last_name} ${client.first_name}`}
            disabled
          />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              label="Ngày đặt"
              variant="outlined"
              value={formatDate(
                new Date(appointment.booking_date),
                "dd-MM-yyyy"
              )}
              disabled
            />
            <TextField
              fullWidth
              label="Thời gian bắt đầu - dự kiến kết thúc"
              variant="outlined"
              value={`${formatTime(appointment.start_time)} - ${formatTime(
                appointment.end_time
              )}`}
              disabled
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Gói makeup"
              variant="outlined"
              value={`${appointment.service.service_name}`}
              disabled
            />
            <TextField
              fullWidth
              label="Số lượng người đặt makeup"
              variant="outlined"
              value={`${appointment.group_size}`}
              disabled
            />
            <TextField
              fullWidth
              label="Tổng giá tiền"
              variant="outlined"
              value={`${formatCurrency(appointment.total_price)} VNĐ`}
              disabled
            />
          </Box>
          <TextField
            fullWidth
            label="Ghi chú của khách hàng"
            variant="outlined"
            value={appointment.client_note || "Không có"}
            disabled
            InputProps={{
              style: {
                color: appointment.client_note ? "inherit" : "#888",
              },
            }}
          />
          <TextField
            fullWidth
            label="Địa chỉ makeup"
            variant="outlined"
            value={
              appointment.address_type === BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS
                ? "Studio của tôi"
                : "Địa chỉ của khách hàng"
            }
            disabled
          />
          <TextField
            fullWidth
            label="Địa chỉ cụ thể"
            variant="outlined"
            value={location}
            disabled
          />

          <FormControl fullWidth error={!!errors.verify_status}>
            <InputLabel id="verify-status-label">
              Trạng thái phê duyệt
            </InputLabel>
            <Select
              labelId="verify-status-label"
              id="verify-status"
              value={watch("verify_status")}
              label="Trạng thái phê duyệt"
              {...register("verify_status")}
            >
              <MenuItem value={BOOKING_STATUS.REJECTED}>Từ chối</MenuItem>
              <MenuItem value={BOOKING_STATUS.APPROVED}>Duyệt</MenuItem>
            </Select>
            {errors.verify_status && (
              <FormHelperText>{errors.verify_status.message}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            label="Lý do"
            value={watch("reason")}
            error={!!errors.reason}
            helperText={errors.reason?.message}
            {...register("reason")}
          />

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Lưu
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ScheduleCard;
