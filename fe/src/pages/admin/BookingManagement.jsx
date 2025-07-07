import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import appointmentApis from "../../apis/appointments.apis";
import { APPOINTMENT_STATUS_DISPLAY, USER_ROLE } from "../../constants/enum";
import HttpStatusCode from "../../constants/httpStatus";

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "black",
  color: "white",
  fontSize: 16,
}));

const statusList = [
  "ALL",
  "PENDING",
  "APPROVED",
  "CONFIRMED",
  "PAID",
  "COMPLETED",
];

const statusColors = {
  PENDING: "#f59e0b",
  APPROVED: "#3b82f6",
  CONFIRMED: "#8b5cf6",
  PAID: "#22c55e",
  COMPLETED: "#6b7280",
};

export default function BookingManagement() {
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [bookings, setBookings] = useState([]);

  const getAllAppointments = async () => {
    const response = await appointmentApis.getAllAppointments(USER_ROLE.ADMIN);
    if (response.status === HttpStatusCode.Ok) {
      setBookings(response.data.result);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  // Đếm số lượng từng trạng thái
  const statusCounts = bookings.reduce((acc, booking) => {
    const status = booking.appointmentStatusLog.at(-1);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (status) => statusColors[status] || "inherit";

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" color="primary" marginBottom={3}>
        Danh sách lịch hẹn
      </Typography>

      {loading ? (
        <Skeleton height={300} />
      ) : (
        <>
          <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
            {statusList.map((status) => {
              const count =
                status === "ALL" ? bookings.length : statusCounts[status] || 0;

              return (
                <Chip
                  key={status}
                  label={`${
                    status === "ALL"
                      ? "Tất cả"
                      : APPOINTMENT_STATUS_DISPLAY[status]
                  } (${count})`}
                  onClick={() => setStatusFilter(status)}
                  sx={{
                    fontWeight: "600",
                  }}
                  variant={statusFilter === status ? "filled" : "outlined"}
                />
              );
            })}
          </Stack>

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>STT</StyledTableCell>
                  <StyledTableCell>Tên Khách hàng</StyledTableCell>
                  <StyledTableCell>Sđt</StyledTableCell>
                  <StyledTableCell>Tên Artist</StyledTableCell>
                  <StyledTableCell>Sđt</StyledTableCell>
                  <StyledTableCell>Gói dịch vụ</StyledTableCell>
                  <StyledTableCell>Trạng thái</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings
                  .filter((row) => {
                    const status = row.appointmentStatusLog.at(-1);
                    return statusFilter === "ALL" || status === statusFilter;
                  })
                  .map((row, index) => {
                    const status = row.appointmentStatusLog.at(-1);
                    return (
                      <TableRow key={row.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          {row.client.last_name} {row.client.first_name}
                        </TableCell>
                        <TableCell>{row.client_phone}</TableCell>
                        <TableCell>{row.artist.name}</TableCell>
                        <TableCell>{row.artist_phone}</TableCell>
                        <TableCell>{row.service.service_name}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              color: getStatusColor(status),
                            }}
                          >
                            {APPOINTMENT_STATUS_DISPLAY[status]}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
