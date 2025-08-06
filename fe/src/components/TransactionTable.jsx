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
} from "@mui/material";

export default function TransactionTable({ transactions }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tổng tiền</TableCell>
            <TableCell>Hình thức thanh toán</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày giao dịch</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.amount.toLocaleString()}₫</TableCell>
              <TableCell>{item.method}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
