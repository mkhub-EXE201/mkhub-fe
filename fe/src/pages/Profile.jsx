import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Skeleton from "../components/Skeleton";
import userApis from "../apis/users.apis";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
import appointmentApis from "../apis/appointments.apis";
import { APPOINTMENT_STATUS_DISPLAY, DUAL_MODE } from "../constants/enum";
import { formatDate, formatTime } from "../utils/utils";
import CheckoutModal from "../components/CheckoutModal";
import paymentApi from "../apis/payments.apis";
import AppointmentCard from "../components/AppointmentCard";
import bookingApis from "../apis/bookings.apis";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [value, setValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null);
  const [selectedAppointmentCheckout, setSelectedAppointmentCheckout] =
    useState(null);

  const STATUS_STEPS = [
    { label: "Chờ xác nhận", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đã thanh toán", value: "PAID" },
    { label: "Đã từ chối", value: "REJECTED" },
    { label: "Hoàn thành", value: "COMPLETED" },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const selectedStatus = STATUS_STEPS[activeStep].value;

  const getLatestStatus = (item) => {
    // Nếu có status log (appointment)
    if (Array.isArray(item.appointmentStatusLog)) {
      return item.appointmentStatusLog.at(-1);
    }
    // Nếu có status (booking)
    return item.status;
  };

  const filteredAppointments = appointments.filter(
    (appointment) => getLatestStatus(appointment) === selectedStatus
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingRes, appointmentRes] = await Promise.all([
          userApis.getMe(),
          bookingApis.getBookingRequests("MEMBER"),
          appointmentApis.getAllAppointments(DUAL_MODE.CLIENT),
        ]);

        if (profileRes.status === HttpStatusCode.Ok) {
          setProfile(profileRes.data.result);
        }
        let appointmentsData = [];
        if (bookingRes.status === HttpStatusCode.Ok) {
          const filterBookings = bookingRes.data.result.filter(
            (item) => item.status !== "APPROVED"
          );
          appointmentsData = [...appointmentsData, ...filterBookings];
        }
        if (appointmentRes.status === HttpStatusCode.Ok) {
          appointmentsData = [
            ...appointmentsData,
            ...appointmentRes.data.result,
          ];
        }
        if (appointmentsData.length > 0) {
          setAppointments(appointmentsData);
        }
      } catch (error) {
        toast.error(error.message || error.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Navbar />
      <Box>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Box sx={{ padding: 3 }}>
            {/* Hồ sơ người dùng */}
            <Box
              sx={{
                padding: 3,
                margin: "0 auto",
                marginTop: 5,
                borderRadius: 5,
                width: { xs: "90%", md: "85%" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Avatar
                  src={profile?.avatar_url}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                  alt="User Avatar"
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontSize: 24, fontWeight: "bold", mb: 1 }}>
                    {profile?.last_name} {profile?.first_name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Typography>{profile?.email}</Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography sx={{ fontSize: 16, color: "gray" }}>
                      {profile?.phone_number}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ marginX: 10, padding: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="Lịch hẹn makeup" />
                  <Tab label="Sổ địa chỉ" />
                  <Tab label="Ưu đãi của tôi" />
                </Tabs>
              </Box>

              {/* Tab nội dung */}
              {value === 0 && (
                <Box sx={{ p: 3 }}>
                  {/* Stepper */}
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{ mb: 4 }}
                  >
                    {STATUS_STEPS.map((step, index) => (
                      <Step key={step.value} completed={false}>
                        <StepLabel
                          onClick={() => {
                            setActiveStep(index);
                            console.log("Clicked step:", index);
                          }}
                          sx={{ cursor: "pointer" }}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {/* Danh sách lịch hẹn */}
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onViewDetail={() =>
                          setSelectedAppointmentDetail(appointment)
                        }
                        onCheckout={() => {
                          setSelectedAppointmentCheckout(appointment);
                          setOpenCheckoutModal(true);
                        }}
                      />
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      Không có lịch hẹn ở trạng thái này.
                    </Typography>
                  )}
                </Box>
              )}

              {value === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography>Sổ địa chỉ đang được phát triển.</Typography>
                </Box>
              )}

              {value === 2 && (
                <Box sx={{ p: 3 }}>
                  <Typography>Ưu đãi đang được phát triển.</Typography>
                </Box>
              )}
            </Box>

            {/* Modal thanh toán */}
            <CheckoutModal
              open={openCheckoutModal}
              onClose={() => setOpenCheckoutModal(false)}
              appointment={selectedAppointmentCheckout}
              onConfirm={async (paymentMethod) => {
                setOpenCheckoutModal(false);

                if (paymentMethod === "stripe") {
                  try {
                    const response = await paymentApi.createPaymentSession({
                      appointment_id: selectedAppointmentCheckout.id,
                    });
                    if (response.status === HttpStatusCode.Ok) {
                      window.location.href = response.data.result;
                    } else {
                      toast.error("Đã xảy ra lỗi khi tạo phiên thanh toán.");
                    }
                  } catch (error) {
                    console.error("Lỗi khi tạo phiên Stripe:", error);
                  }
                }
              }}
            />

            {/* Modal chi tiết lịch hẹn */}
            <Dialog
              open={!!selectedAppointmentDetail}
              onClose={() => setSelectedAppointmentDetail(null)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
              <DialogContent dividers>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedAppointmentDetail?.artist?.name}
                </Typography>
                <Typography variant="body2">
                  Dịch vụ: {selectedAppointmentDetail?.service?.service_name}
                </Typography>
                <Typography variant="body2">
                  Địa điểm: {selectedAppointmentDetail?.district_name},{" "}
                  {selectedAppointmentDetail?.province_name}
                </Typography>
                <Typography variant="body2">
                  Thời gian: {formatTime(selectedAppointmentDetail?.start_time)}{" "}
                  - {formatTime(selectedAppointmentDetail?.end_time)}
                </Typography>
                <Typography variant="body2">
                  Ngày: {formatDate(selectedAppointmentDetail?.booking_date)}
                </Typography>
                <Typography variant="body2">
                  Trạng thái:{" "}
                  {
                    APPOINTMENT_STATUS_DISPLAY[
                      selectedAppointmentDetail?.appointmentStatusLog?.at(-1)
                    ]
                  }
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedAppointmentDetail(null)}>
                  Đóng
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  );
}
