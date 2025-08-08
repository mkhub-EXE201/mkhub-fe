import React, { useEffect, useState } from "react";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EventNoteOutlined from "@mui/icons-material/EventNoteOutlined";
import { Box, Card, CircularProgress, Typography } from "@mui/material";
import HttpStatusCode from "../../constants/httpStatus";
import userApis from "../../apis/users.apis";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import adminApis from "../../apis/admin.apis";
import { formatToVND } from "../../utils/utils";
import AdminDashboardChart from "../../components/AdminDashboardChart";
import RevenueChart from "../../components/RevenueChart";
import transactionApis from "../../apis/transactions.apis";
import TransactionTable from "../../components/TransactionTable";

export default function AdminDashboard() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const getTotalBookings = async () => {
    try {
      const response = await adminApis.getAllAppointments();
      if (response.status === HttpStatusCode.Ok) {
        setTotalBookings(response.data.result.length);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const getTotalUsers = async () => {
    try {
      const response = await userApis.getUsers();
      if (response.status === HttpStatusCode.Ok) {
        setTotalUsers(response.data.result.length);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const getPlatformRevenue = async () => {
    try {
      const response = await adminApis.getPlatformRevenue();
      if (response.status === HttpStatusCode.Ok) {
        setRevenue(response.data.result);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const getPlatformTransactions = async () => {
    try {
      const response = await transactionApis.getAllTransactions();
      if (response.status === HttpStatusCode.Ok) {
        setTransactions(response.data.result);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getTotalBookings(),
        getTotalUsers(),
        getPlatformRevenue(),
        getPlatformTransactions(),
      ]).finally(setLoading(false));
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems={"center"}
        minHeight="80vh"
        width="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* số users */}
          <Card
            variant="outlined"
            sx={{
              width: 300,
              padding: 2,
              borderRadius: 5,
            }}
          >
            <PeopleOutlineIcon
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "#f2f4f7",
                padding: 2,
                borderRadius: 2,
              }}
            />
            <Typography
              sx={{ marginY: 2, fontSize: 14, color: "text.secondary" }}
            >
              Tài khoản
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "text.primary",
                }}
              >
                {totalUsers}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#ecfdf3",
                  color: "#039855",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: "9999px",
                  paddingY: "2px",
                  paddingX: "8px",
                  gap: "4px",
                }}
              >
                {/* Icon SVG nè */}
                <Box
                  component="svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247V10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125V3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                  />
                </Box>
                11.01%
              </Box>
            </Box>
          </Card>
          {/* số lịch hẹn */}
          <Card
            variant="outlined"
            sx={{
              width: 300,
              padding: 2,
              borderRadius: 5,
            }}
          >
            <EventNoteOutlined
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "#f2f4f7",
                padding: 2,
                borderRadius: 2,
              }}
            />
            <Typography
              sx={{ marginY: 2, fontSize: 14, color: "text.secondary" }}
            >
              Lịch hẹn
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "text.primary",
                }}
              >
                {totalBookings}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#ecfdf3",
                  color: "#039855",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: "9999px",
                  paddingY: "2px",
                  paddingX: "8px",
                  gap: "4px",
                }}
              >
                {/* Icon SVG nè */}
                <Box
                  component="svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247V10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125V3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                  />
                </Box>
                11.01%
              </Box>
            </Box>
          </Card>
          {/* tỉ lệ đánh giá */}
          <Card
            variant="outlined"
            sx={{
              width: 300,
              padding: 2,
              borderRadius: 5,
            }}
          >
            <AccountBalanceWalletIcon
              sx={{
                width: 50,
                height: 50,
                backgroundColor: "#f2f4f7",
                padding: 2,
                borderRadius: 2,
              }}
            />
            <Typography
              sx={{ marginY: 2, fontSize: 14, color: "text.secondary" }}
            >
              Tổng lợi nhuận
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: 24,
                  color: "text.primary",
                }}
              >
                {formatToVND(revenue)} VNĐ
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#ecfdf3",
                  color: "#039855",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: "9999px",
                  paddingY: "2px",
                  paddingX: "8px",
                  gap: "4px",
                }}
              >
                {/* Icon SVG nè */}
                <Box
                  component="svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.56462 1.62393C5.70193 1.47072 5.90135 1.37432 6.12329 1.37432C6.1236 1.37432 6.12391 1.37432 6.12422 1.37432C6.31631 1.37415 6.50845 1.44731 6.65505 1.59381L9.65514 4.5918C9.94814 4.88459 9.94831 5.35947 9.65552 5.65246C9.36273 5.94546 8.88785 5.94562 8.59486 5.65283L6.87329 3.93247V10.125C6.87329 10.5392 6.53751 10.875 6.12329 10.875C5.70908 10.875 5.37329 10.5392 5.37329 10.125V3.93578L3.65516 5.65282C3.36218 5.94562 2.8873 5.94547 2.5945 5.65248C2.3017 5.35949 2.30185 4.88462 2.59484 4.59182L5.56462 1.62393Z"
                  />
                </Box>
                11.01%
              </Box>
            </Box>
          </Card>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginX: 2 }}>
          <AdminDashboardChart />
          <RevenueChart />
        </Box>
        <Box sx={{ marginTop: 12 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Chi tiết giao dịch
          </Typography>
          <TransactionTable transactions={transactions} />
        </Box>
      </Box>
    </>
  );
}
