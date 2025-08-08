import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import artistApis from "../../apis/artists.apis";
import { APPOINTMENT_STATUS_DISPLAY } from "../../constants/enum";

export default function ArtistRevenueManagement() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dbBalance, setDbBalance] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [appointmentStats, setAppointmentStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await artistApis.getArtistStats();
        const result = res.data.result;

        setMonthlyData(result.monthly || []);
        setDbBalance(result.db_balance || 0);
        setTotalRevenue(result.total_revenue || 0);
        setTotalProfit(
          result.monthly?.reduce((sum, m) => sum + (m.income || 0), 0) || 0
        );
        setAppointmentStats(result.appointments || {});
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Data cho line chart
  const revenueByMonth = monthlyData.map((m) => ({
    month: `${String(m.month).padStart(2, "0")}/2025`,
    revenue: m.revenue,
  }));
  const profitByMonth = monthlyData.map((m) => ({
    month: `${String(m.month).padStart(2, "0")}/2025`,
    profit: m.income,
  }));

  // Data cho pie chart booking
  const pieData = Object.entries(appointmentStats).map(([status, count]) => ({
    name: APPOINTMENT_STATUS_DISPLAY[status],
    value: count,
  }));

  const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336", "#9c27b0"];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Quản lý Doanh thu & Lợi nhuận
      </Typography>

      {/* Tổng doanh thu & lợi nhuận */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Tổng Doanh thu</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {totalRevenue.toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Tổng Lợi nhuận</Typography>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {totalProfit.toLocaleString("vi-VN")} VNĐ
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Box display="flex" gap={3} mb={4}>
        <Paper sx={{ flex: 1, p: 2, overflow: "visible" }}>
          <Typography variant="h6">Doanh thu theo tháng</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={revenueByMonth}
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3f51b5" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, overflow: "visible" }}>
          <Typography variant="h6">Lợi nhuận theo tháng</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={profitByMonth}
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Booking stats pie chart */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tỉ lệ Booking theo trạng thái
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={(entry) => `${entry.name} (${entry.value})`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
