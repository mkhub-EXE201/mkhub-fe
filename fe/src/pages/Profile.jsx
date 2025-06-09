import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useState } from "react";
import Skeleton from "../components/Skeleton";
import userApis from "../apis/users.apis";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
import appointmentApis from "../apis/appointments.apis";
import { APPOINTMENT_STATUS_DISPLAY, DUAL_MODE } from "../constants/enum";
import { formatDate, formatTime } from "../utils/utils";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [value, setValue] = useState(0);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appointmentRes] = await Promise.all([
          userApis.getMe(),
          appointmentApis.getAllAppointments(DUAL_MODE.CLIENT),
        ]);

        if (profileRes.status === HttpStatusCode.Ok) {
          setProfile(profileRes.data.result);
        }

        if (appointmentRes.status === HttpStatusCode.Ok) {
          setAppointments(appointmentRes.data.result);
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <Navbar />
      <Box>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                padding: 3,
                margin: "0 auto",
                marginTop: 5,
                borderRadius: 5,
                // border: "1px solid black",
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
                {/* Avatar */}
                <Box
                  component="img"
                  src={profile?.avatar_url}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                  alt="Artist Avatar"
                />

                {/* Thông tin Artist */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: 1,
                    }}
                  >
                    {profile?.last_name} {profile?.first_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      {profile?.email}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography
                      sx={{ fontSize: "16px", color: "gray", marginBottom: 1 }}
                    >
                      {profile?.phone_number}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ marginX: 10, padding: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Lịch hẹn makeup" {...a11yProps(0)} />
                  <Tab label="Sổ địa chỉ" {...a11yProps(1)} />
                  <Tab label="Ưu đãi của tôi" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <>
                  {appointments && appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <Card
                        onClick={() => setSelectedAppointment(appointment)}
                        key={index}
                        sx={{
                          mb: 2,
                          boxShadow: 2,
                          borderRadius: 2,
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Avatar src={appointment.artist.avatar_url} />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {appointment.artist.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {appointment.service.service_name}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <PlaceIcon
                              sx={{ fontSize: 18, color: "text.secondary" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.district_name},{" "}
                              {appointment.province_name}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={1}
                          >
                            {`${formatTime(appointment.start_time)} - ${formatTime(
                              appointment.end_time
                            )} | ${formatDate(appointment.booking_date)}`}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={
                                APPOINTMENT_STATUS_DISPLAY[
                                  appointment.appointmentStatusLog[0]
                                ]
                              }
                              color="primary"
                              variant="outlined"
                            />
                            <Button variant="contained" size="small">
                              Thanh toán
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Không có lịch hẹn nào.
                    </Typography>
                  )}
                </>
              </CustomTabPanel>
            </Box>
            <Dialog
              open={!!selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
              <DialogContent dividers>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedAppointment?.artist?.name}
                </Typography>
                <Typography variant="body2">
                  Dịch vụ: {selectedAppointment?.service?.service_name}
                </Typography>
                <Typography variant="body2">
                  Địa điểm: {selectedAppointment?.district_name},{" "}
                  {selectedAppointment?.province_name}
                </Typography>
                <Typography variant="body2">
                  Thời gian: {formatTime(selectedAppointment?.start_time)} -{" "}
                  {formatTime(selectedAppointment?.end_time)}
                </Typography>
                <Typography variant="body2">
                  Ngày: {formatDate(selectedAppointment?.booking_date)}
                </Typography>
                <Typography variant="body2">
                  Trạng thái:{" "}
                  {
                    APPOINTMENT_STATUS_DISPLAY[
                      selectedAppointment?.appointmentStatusLog[0]
                    ]
                  }
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setSelectedAppointment(null)}>
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
function CustomTabPanel(props) {
  // eslint-disable-next-line react/prop-types
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
