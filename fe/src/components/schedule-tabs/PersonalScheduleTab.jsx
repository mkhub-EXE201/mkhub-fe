/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonalScheduleDetails from "./PersonalScheduleDetails";
import CustomProfileCard from "./CustomProfileCard";
import locationApi from "../../apis/locations.apis";
import appointmentApis from "../../apis/appointments.apis";
import { USER_ROLE } from "../../constants/enum";
import { HttpStatusCode } from "axios";

const styles = {
  tabContent: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    marginTop: 3,
  },
  customerContainer: {
    boxShadow: 2,
    width: "100%",
    padding: 3,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
  },
  processContainer: {
    marginTop: 2,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#F13067",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
  stepText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: 500,
  },
};

const statusStepsMap = [
  { status: "CONFIRMED", label: "Chốt lịch" },
  { status: "PAID", label: "Thanh toán" },
  { status: "COMPLETED", label: "Hoàn thành" },
  { status: "REVIEWED", label: "Đánh giá" },
];

function PersonalScheduleTab({ selectedAppointment }) {
  const [appointmentToUse, setAppointmentToUse] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [wardName, setWardName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [provinceName, setProvinceName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data = selectedAppointment;

        // Nếu có selectedAppointment thì lấy chi tiết
        if (selectedAppointment) {
          const response = await appointmentApis.getAppointmentById(
            selectedAppointment.id,
            "booking"
          );
          if (response.status === HttpStatusCode.Ok) {
            data = response.data.result;
          }
        } else {
          // Nếu không có selectedAppointment thì lấy danh sách
          const res = await appointmentApis.getAllAppointments(
            USER_ROLE.ARTIST
          );
          if (res.status === HttpStatusCode.Ok && res.data.result.length > 0) {
            data = res.data.result[0];
            setAppointments(res.data.result);
          }
        }

        setAppointmentToUse(data);

        if (data) {
          const ward = await locationApi.getWardNameByCode(
            data.ward_code,
            data.district_id
          );
          const district = await locationApi.getDistrictNameByCode(
            data.district_id,
            data.province_id
          );
          const province = await locationApi.getProvinceNameByCode(
            data.province_id
          );

          setWardName(ward.data.result);
          setDistrictName(district.data.result);
          setProvinceName(province.data.result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedAppointment]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!appointmentToUse) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center" }}>
        Không có lịch hẹn nào để hiển thị.
      </Typography>
    );
  }
  const latestStatus = appointmentToUse?.appointmentStatusLog?.at(-1);
  const activeStep = Math.max(
    0,
    statusStepsMap.findIndex((step) => step.status === latestStatus)
  );

  console.log(activeStep);

  return (
    <Box sx={styles.tabContent}>
      <Box sx={styles.customerContainer}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Khách hàng
        </Typography>

        <CustomProfileCard
          isHome={false}
          customerData={appointmentToUse}
          wardName={wardName}
          districtName={districtName}
          provinceName={provinceName}
        />

        <Box sx={styles.processContainer}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Quy trình
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel>
            {statusStepsMap.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;

              return (
                <Step key={step.status} completed={isCompleted}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          ...styles.stepIcon,
                          backgroundColor:
                            isCompleted || isActive ? "#F13067" : "#f5f5f5",
                        }}
                      >
                        {isCompleted || isActive ? (
                          <CheckCircleIcon
                            sx={{ color: "white", fontSize: 24 }}
                          />
                        ) : (
                          <CheckCircleOutlineIcon
                            sx={{ color: "#999", fontSize: 24 }}
                          />
                        )}
                      </Box>
                    )}
                  >
                    <Typography
                      sx={{
                        ...styles.stepText,
                        color: isCompleted || isActive ? "#000" : "#999",
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <Divider sx={{ my: 4 }} />

          <PersonalScheduleDetails
            appointment={appointmentToUse}
            wardName={wardName}
            districtName={districtName}
            provinceName={provinceName}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PersonalScheduleTab;
