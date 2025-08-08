/* eslint-disable react/prop-types */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  useTheme, // Import useTheme from MUI
} from "@mui/material";
import { TRANSACTION_STATUS_DISPLAY } from "../constants/enum";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TransactionTable({ transactions }) {
  const theme = useTheme(); // Access the theme

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>STT</StyledTableCell>
            <StyledTableCell>Tên Khách Hàng</StyledTableCell>
            <StyledTableCell>Tên Makeup Artist</StyledTableCell>
            <StyledTableCell>Tổng tiền</StyledTableCell>
            <StyledTableCell>Hình thức thanh toán</StyledTableCell>
            <StyledTableCell>Trạng thái chuyển khoản</StyledTableCell>
            <StyledTableCell>Ngày giao dịch</StyledTableCell>
          </StyledTableRow>
        </TableHead>

        <TableBody>
          {transactions &&
            transactions.map((item, index) => (
              <StyledTableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.user.last_name} {item.user.first_name}
                </TableCell>
                <TableCell>{item.artist.name}</TableCell>
                <TableCell>{item.amount.toLocaleString()}₫</TableCell>
                <TableCell>{item.method}</TableCell>
                <TableCell>{TRANSACTION_STATUS_DISPLAY[item.status]}</TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleString()}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
