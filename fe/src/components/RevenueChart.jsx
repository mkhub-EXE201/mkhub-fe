import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import adminApis from "../apis/admin.apis";
import { HttpStatusCode } from "axios";

export default function RevenueChartMock() {
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    getMonthlyRevenue();
  }, []);

  const getMonthlyRevenue = async () => {
    const response = await adminApis.getPlatformMonthlyRevenue();
    if (response.status === HttpStatusCode.Ok) {
      const rawData = response.data.result;

      const formattedData = Object.entries(rawData).map(([month, revenue]) => ({
        month,
        revenue,
      }));

      formattedData.sort((a, b) => {
        const [aMonth, aYear] = a.month.split("/").map(Number);
        const [bMonth, bYear] = b.month.split("/").map(Number);
        return aYear === bYear ? aMonth - bMonth : aYear - bYear;
      });

      setRevenue(formattedData);
    }
  };

  return (
    <Box sx={{ width: "100%", height: 400, mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Doanh thu theo tháng
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `${v / 1000000}tr`} />
          <Tooltip formatter={(v) => `${v.toLocaleString()} đ`} />
          <Bar dataKey="revenue" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
