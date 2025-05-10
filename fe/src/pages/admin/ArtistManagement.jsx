import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import adminApis from "../../apis/admin.apis";
import HttpStatusCode from "../../constants/httpStatus";
import { ARTIST_APPLICATION_STATUS } from "../../constants/enum";
import { formatDateTime, getStatusColor } from "../../utils/utils";
import { Box, Typography } from "@mui/material";

export default function ArtistManagement() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getArtistApplications = async () => {
      try {
        const response = await adminApis.getArtistApplicationsByStatus("");
        if (response.status === HttpStatusCode.Ok) {
          setApplications(response.data.result);
        }
      } catch (error) {
        toast.error(error.message || error.response.data.msg);
      } finally {
        setLoading(false);
      }
    };
    getArtistApplications();
  }, []);
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h1" color="primary" marginBottom={3}>
        Danh sách đăng kí MKUB Artist
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell align="left">Tên</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Ngày đăng kí</TableCell>
              <TableCell align="left">Lượt gửi</TableCell>
              <TableCell align="left">Trạng thái</TableCell>
              <TableCell align="left">Lý do</TableCell>
              <TableCell align="left">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((row, index) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  {formatDateTime(row.created_at)}
                </TableCell>
                <TableCell align="left">{row.number_of_submission}</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: getStatusColor(row.status),
                  }}
                >
                  {ARTIST_APPLICATION_STATUS[row.status]}
                </TableCell>
                <TableCell align="left">{row.reason}</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {}}
                >
                  Chi tiết
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
