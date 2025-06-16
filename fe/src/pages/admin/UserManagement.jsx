import {
  Box,
  Paper,
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
import Skeleton from "../../components/Skeleton";
import userApis from "../../apis/users.apis";
import HttpStatusCode from "../../constants/httpStatus";
import { formatDateTime, getStatusColor } from "../../utils/utils";
import { USER_ROLE_DISPLAY } from "../../constants/enum";

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "black",
  color: "white",
  fontSize: 16,
}));

export default function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getTotalUsers = async () => {
    try {
      const response = await userApis.getUsers();
      if (response.status === HttpStatusCode.Ok) {
        setUsers(response.data.result);
        setLoading(false);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      await getTotalUsers();
    };
    getUsers();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" color="primary" marginBottom={3}>
        Danh sách tài khoản người dùng
      </Typography>

      {loading ? (
        <Skeleton />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>STT</StyledTableCell>
                <StyledTableCell>Tên</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Số điện thoại</StyledTableCell>
                <StyledTableCell>Ngày đăng kí</StyledTableCell>
                <StyledTableCell>Chế độ kép</StyledTableCell>
                <StyledTableCell>Quyền hạn</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {row.last_name} {row.first_name}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone_number}</TableCell>
                  <TableCell>{formatDateTime(row.created_at)}</TableCell>
                  <TableCell>{row.is_artist.toString()}</TableCell>
                  <TableCell>{USER_ROLE_DISPLAY[row.role]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
