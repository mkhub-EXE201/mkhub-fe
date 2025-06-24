/* eslint-disable react/prop-types */
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import React from "react";
import { APPOINTMENT_STATUS } from "../constants/enum";

const STEPS = [
  { label: "Chờ xác nhận", value: APPOINTMENT_STATUS.PENDING },
  { label: "Đã xác nhận", value: APPOINTMENT_STATUS.CONFIRMED },
  { label: "Đã thanh toán", value: APPOINTMENT_STATUS.PAID },
  { label: "Hoàn thành", value: APPOINTMENT_STATUS.COMPLETED },
];

const AppointmentProgressBar = ({ statusLog }) => {
  const activeStep =
    STEPS.findIndex((step) => statusLog.includes(step.value)) + 1;

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((step) => (
          <Step key={step.value}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default AppointmentProgressBar;
