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
  CircularProgress,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import adminApis from "../../apis/admin.apis";
import HttpStatusCode from "../../constants/httpStatus";
import {
  ARTIST_APPLICATION_STATUS_DISPLAY,
  ARTIST_APPLICATION_STATUS,
  EMIT_TYPE,
} from "../../constants/enum";
import { formatDateTime, getStatusColor } from "../../utils/utils";
import Modal from "../../components/Modal";
import createSocket from "../../utils/socket";
import { AppContext } from "../../contexts/app.context";
import Lottie from "react-lottie";
import loadingAnimation from "../../assets/progressLoading.json";

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "black",
  color: "white",
  fontSize: 16,
}));

const STATUS_LIST = ["ALL", ...Object.keys(ARTIST_APPLICATION_STATUS)];

export default function ArtistManagement() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { profile } = useContext(AppContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (profile?.id && profile?.role) {
      const newSocket = createSocket(profile.id, profile.role);
      setSocket(newSocket);

      newSocket.on(EMIT_TYPE.NOTIFICATION, (notification) => {
        toast.success(notification);
        getArtistApplications();
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [profile]);

  const handleOpen = (application) => {
    setSelectedApplication(application);
  };

  const handleClose = () => {
    setSelectedApplication(null);
  };

  const getArtistApplications = async () => {
    try {
      const response = await adminApis.getArtistApplicationsByStatus("");
      if (response.status === HttpStatusCode.Ok) {
        setApplications(response.data.result);
      }
    } catch (error) {
      toast.error(error.message || error.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArtistApplications();
  }, []);

  // Đếm số lượng theo status
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Filter theo status
  const filteredApplications =
    statusFilter === "ALL"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" color="primary" marginBottom={3}>
        Danh sách đăng kí MKUB Artist
      </Typography>

      <>
        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
          {STATUS_LIST.map((status) => {
            const count =
              status === "ALL"
                ? applications.length
                : statusCounts[status] || 0;
            return (
              <Chip
                key={status}
                label={`${
                  status === "ALL"
                    ? "Tất cả"
                    : ARTIST_APPLICATION_STATUS_DISPLAY[status]
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
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>STT</StyledTableCell>
                <StyledTableCell>Tên</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Ngày đăng kí</StyledTableCell>
                <StyledTableCell>Lượt gửi</StyledTableCell>
                <StyledTableCell>Trạng thái</StyledTableCell>
                <StyledTableCell>Lý do</StyledTableCell>
                <StyledTableCell>Hành động</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{formatDateTime(row.created_at)}</TableCell>
                  <TableCell>{row.number_of_submission}</TableCell>
                  <TableCell sx={{ color: getStatusColor(row.status) }}>
                    {ARTIST_APPLICATION_STATUS_DISPLAY[row.status]}
                  </TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        bgcolor: (theme) => theme.palette.action.hover,
                      },
                    }}
                    onClick={() => handleOpen(row)}
                  >
                    Chi tiết
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>

      {/* Modal Chi Tiết */}
      <Modal
        open={!!selectedApplication}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        getArtistApplications={getArtistApplications}
        selectedApplication={selectedApplication}
      />
    </Box>
  );
}
