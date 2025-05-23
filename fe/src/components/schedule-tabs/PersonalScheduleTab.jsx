import React from "react";
import { Box, Typography, Stepper, Step, StepLabel, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import artistBanner from "../../assets/artist-banner.jpg";
import PersonalScheduleDetails from "./PersonalScheduleDetails";
import CustomProfileCard from "./CustomProfileCard";

const styles = {
    tabContent: { display: "flex", flexDirection: "column", gap: 3, marginTop: 3 },
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
    calendarContainer: (isLaptop) => ({
        width: isLaptop ? "100%" : "50%",
        height: isLaptop ? "500px" : "100%",
    }),
    dailyViewContainer: (isLaptop) => ({
        display: "flex",
        flexDirection: isLaptop ? "column" : "row",
        gap: 3,
        height: isLaptop ? "auto" : "500px",
    }),
};

const customerData = {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: artistBanner,
    location: "Bình Thạnh, Hồ Chí Minh",
    phone: "+84 123 456 789",
    email: "nguyenvana@email.com",
    appointmentDate: new Date(2025, 4, 15),
    service: "Makeup hàng ngày concept nhẹ nhàng",
    time: "9:00 AM",
};

// Process steps data
const processSteps = [
    { id: 1, label: "Chốt lịch", completed: true },
    { id: 2, label: "Đi chuyến đến điểm hẹn", completed: true },
    { id: 3, label: "Trong quá trình Makeup", completed: true },
    { id: 4, label: "Hoàn thành", completed: true },
    { id: 5, label: "Thanh toán", completed: true },
];

function PersonalScheduleTab() {
    return (
        <Box sx={styles.tabContent}>
            {/* Customer Info Section */}
            <Box sx={styles.customerContainer}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Khách hàng
                </Typography>

                {/* Customer Information Card */}
                <CustomProfileCard customerData={customerData} />

                {/* Process Flow Section */}
                <Box sx={styles.processContainer}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Quy trình
                    </Typography>

                    <Stepper activeStep={3} alternativeLabel>
                        {processSteps.map((step, index) => (
                            <Step key={step.id} completed={step.completed}>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <Box sx={{
                                            ...styles.stepIcon,
                                            backgroundColor: index <= 3 ? "#F13067" : "#f5f5f5",
                                        }}>
                                            {index <= 3 ? (
                                                <CheckCircleIcon
                                                    sx={{
                                                        color: "white",
                                                        fontSize: 24,
                                                    }}
                                                />
                                            ) : (
                                                <CheckCircleOutlineIcon
                                                    sx={{
                                                        color: "#999",
                                                        fontSize: 24,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    )}
                                >
                                    <Typography sx={{
                                        ...styles.stepText,
                                        color: index <= 3 ? "#000" : "#999",
                                    }}>
                                        {step.label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Divider sx={{ my: 4 }} />

                    {/* Appointment Tabs Section */}
                    <PersonalScheduleDetails />
                </Box>
            </Box>
        </Box>
    );
}

export default PersonalScheduleTab;