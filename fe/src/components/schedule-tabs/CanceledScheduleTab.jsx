import React from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider } from "@mui/material";
import EventBusyIcon from '@mui/icons-material/EventBusy';

const styles = {
    tabPanel: {
        width: "100%",
        padding: 3,
    },
    tabTitle: {
        fontWeight: "600",
        fontSize: 20,
        marginBottom: 3
    },
    canceledList: {
        boxShadow: 2,
        borderRadius: 2,
        padding: 2,
        backgroundColor: '#fff'
    },
    listItem: {
        borderRadius: 1,
        marginBottom: 1,
        padding: 2
    },
    chipCanceled: {
        backgroundColor: '#ffcdd2',
        color: '#c62828',
        fontWeight: 500
    },
    reasonBox: {
        marginTop: 1,
        padding: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 1
    }
};

// Mock data for canceled appointments
const canceledAppointments = [
    {
        id: 1,
        customerName: "Nguyễn Thị Anh",
        service: "Makeup chụp ảnh cưới",
        date: "12/05/2025",
        time: "10:00 AM",
        reasonForCancellation: "Khách hàng thay đổi lịch trình",
        canceledBy: "customer"
    },
    {
        id: 2,
        customerName: "Trần Văn Minh",
        service: "Makeup sự kiện quan trọng",
        date: "14/05/2025",
        time: "2:30 PM",
        reasonForCancellation: "Nghệ sĩ bận lịch khác",
        canceledBy: "artist"
    },
    {
        id: 3,
        customerName: "Phạm Thị Hương",
        service: "Makeup dự tiệc",
        date: "18/05/2025",
        time: "6:00 PM",
        reasonForCancellation: "Thay đổi địa điểm không phù hợp",
        canceledBy: "mutual"
    }
];

function CanceledScheduleTab() {
    return (
        <Box sx={styles.tabPanel}>
            <Typography sx={styles.tabTitle}>
                Lịch đã hủy
            </Typography>

            <Box sx={styles.canceledList}>
                <List>
                    {canceledAppointments.map((appointment, index) => (
                        <React.Fragment key={appointment.id}>
                            <ListItem alignItems="flex-start" sx={styles.listItem}>
                                <ListItemAvatar>
                                    <Avatar sx={{ backgroundColor: '#ffcdd2' }}>
                                        <EventBusyIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography component="span" variant="h6">
                                                {appointment.customerName}
                                            </Typography>
                                            <Chip
                                                label="Đã hủy"
                                                size="small"
                                                sx={styles.chipCanceled}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                                {appointment.service}
                                            </Typography>
                                            <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                                {appointment.date} | {appointment.time}
                                            </Typography>
                                            <Box sx={styles.reasonBox}>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    Lý do hủy:
                                                </Typography>
                                                <Typography component="span" variant="body2" sx={{ ml: 1 }}>
                                                    {appointment.reasonForCancellation}
                                                </Typography>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            {index < canceledAppointments.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default CanceledScheduleTab;