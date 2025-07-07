import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import React from "react";
const COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#22c55e", "#6b7280"];

const statusChartData = [
  { name: "Chờ duyệt", value: 10 },
  { name: "Đã duyệt", value: 8 },
  { name: "Đã xác nhận", value: 5 },
  { name: "Đã thanh toán", value: 4 },
  { name: "Hoàn thành", value: 2 },
];

export default function AdminDashboardChart() {
  return (
    <Box sx={{ width: "100%", height: 400, mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Thống kê lịch hẹn theo trạng thái
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusChartData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >
            {statusChartData.map((entry, index) => (
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
    </Box>
  );
}
