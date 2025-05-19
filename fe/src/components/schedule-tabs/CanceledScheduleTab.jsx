import React from "react";
import { Box, Typography, Card, CardContent, Avatar, Chip, Grid, Divider } from "@mui/material";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PersonIcon from '@mui/icons-material/Person';

// Sample data format
const canceledAppointments = Array(5).fill({
    id: 1,
    customerName: "Nguyễn Thị B",
    service: "Makeup chụp ảnh cưới",
    date: "12/05/2025",
    time: "10:00 AM",
    reasonForCancellation: "Khách hàng thay đổi lịch trình",
    canceledBy: "customer"
});

const styles = {
    tabContent: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
        marginTop: 3,
        padding: 2
    },
    card: {
        marginBottom: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
    },
    chipCanceled: {
        backgroundColor: '#ffcdd2',
        color: '#c62828',
        fontWeight: 500
    },
    avatar: {
        backgroundColor: '#ffcdd2',
        marginBottom: 1
    },
    reasonBox: {
        marginTop: 1,
        padding: 1.5,
        backgroundColor: '#f5f5f5',
        borderRadius: 1
    },
    cardContainer: {
        padding: 3,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: '#fff'
    }
};

function CanceledAppointmentCards() {
    return (
        <Box sx={styles.cardContainer}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Lịch đã hủy
            </Typography>

            <Grid container spacing={2}>
                {canceledAppointments.map((appointment, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`${appointment.id}-${index}`}>
                        <Card sx={styles.card}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Avatar sx={styles.avatar}>
                                        <PersonIcon />
                                    </Avatar>
                                    <Chip
                                        icon={<EventBusyIcon sx={{ fontSize: '16px !important' }} />}
                                        label="Đã hủy"
                                        size="small"
                                        sx={styles.chipCanceled}
                                    />
                                </Box>

                                <Typography variant="h6" gutterBottom>
                                    {appointment.customerName}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Dịch vụ:</strong> {appointment.service}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <strong>Thời gian:</strong> {appointment.date} | {appointment.time}
                                </Typography>

                                <Box sx={styles.reasonBox}>
                                    <Typography variant="body2" color="text.primary" gutterBottom>
                                        <strong>Lý do hủy:</strong>
                                    </Typography>
                                    <Typography variant="body2">
                                        {appointment.reasonForCancellation}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Hủy bởi: {appointment.canceledBy === 'customer' ? 'Khách hàng' :
                                            appointment.canceledBy === 'artist' ? 'Nghệ sĩ' : 'Hai bên'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

function CanceledScheduleTab() {
    return (
        <Box sx={styles.tabContent}>
            <CanceledAppointmentCards />
            <Divider sx={{ my: 2 }} />
            {/* You can add additional sections here if needed */}
        </Box>
    );
}

export default CanceledScheduleTab;