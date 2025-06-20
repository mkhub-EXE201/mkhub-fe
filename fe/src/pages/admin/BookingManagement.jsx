import {
  Box,
  Paper,
  Skeleton,
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

export default function BookingManagement() {
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState([]);
  const getAllAppointments = async () => {
    const response = await appointmentApis.getAllAppointments(USER_ROLE.ADMIN);
    if (response.status === HttpStatusCode.Ok) {
      console.log(response.data.result);
      setBookings(response.data.result);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" color="primary" marginBottom={3}>
        Danh sách lịch hẹn
      </Typography>

      {loading ? (
        <Skeleton />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
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
              {bookings.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {row.client.last_name} {row.client.first_name}
                  </TableCell>
                  <TableCell>{row.client_phone}</TableCell>{" "}
                  <TableCell>{row.artist.name}</TableCell>
                  <TableCell>{row.artist_phone}</TableCell>
                  <TableCell>{row.service.service_name}</TableCell>{" "}
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          row.appointmentStatusLog[
                            row.appointmentStatusLog.length - 1
                          ] === "PAID"
                            ? "#4ade80"
                            : "inherit",
                        fontWeight: 500,
                      }}
                    >
                      {
                        APPOINTMENT_STATUS_DISPLAY[
                          row.appointmentStatusLog[
                            row.appointmentStatusLog.length - 1
                          ]
                        ]
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
