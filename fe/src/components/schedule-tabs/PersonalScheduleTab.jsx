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

const processSteps = [
  { id: 1, label: "Chốt lịch", completed: true },
  { id: 2, label: "Đi chuyến đến điểm hẹn", completed: true },
  { id: 3, label: "Trong quá trình Makeup", completed: true },
  { id: 4, label: "Hoàn thành", completed: true },
  { id: 5, label: "Thanh toán", completed: true },
];

function PersonalScheduleTab({ selectedAppointment }) {
  const [appointments, setAppointments] = useState([]);
  const [wardName, setWardName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [provinceName, setProvinceName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getAppointments = async () => {
    try {
      const response = await appointmentApis.getAllAppointments(
        USER_ROLE.ARTIST
      );
      if (response.status === HttpStatusCode.Ok) {
        setAppointments(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const getLocation = async (appointmentData) => {
    if (!appointmentData) return;

    try {
      const ward = await locationApi.getWardNameByCode(
        appointmentData.ward_code,
        appointmentData.district_id
      );
      const district = await locationApi.getDistrictNameByCode(
        appointmentData.district_id,
        appointmentData.province_id
      );
      const province = await locationApi.getProvinceNameByCode(
        appointmentData.province_id
      );

      setWardName(ward.data.result);
      setDistrictName(district.data.result);
      setProvinceName(province.data.result);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getAppointments();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const appointment = selectedAppointment || appointments[0];
    if (appointment) getLocation(appointment);
  }, [selectedAppointment, appointments]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const appointmentToUse = selectedAppointment || appointments[0];

  if (!appointmentToUse) {
    return (
      <Typography sx={{ mt: 5, textAlign: "center" }}>
        Không có lịch hẹn nào để hiển thị.
      </Typography>
    );
  }

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

          <Stepper activeStep={3} alternativeLabel>
            {processSteps.map((step, index) => (
              <Step key={step.id} completed={step.completed}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        ...styles.stepIcon,
                        backgroundColor: index <= 3 ? "#F13067" : "#f5f5f5",
                      }}
                    >
                      {index <= 3 ? (
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
                      color: index <= 3 ? "#000" : "#999",
                    }}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
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
