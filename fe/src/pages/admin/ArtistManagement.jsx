import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import adminApis from "../../apis/admin.apis";
import HttpStatusCode from "../../constants/httpStatus";
import {
  ARTIST_APPLICATION_STATUS_DISPLAY,
  EMIT_TYPE,
} from "../../constants/enum";
import { formatDateTime, getStatusColor } from "../../utils/utils";
import { Box, Skeleton, styled, Typography } from "@mui/material";
import Modal from "../../components/Modal";
import createSocket from "../../utils/socket";
import { AppContext } from "../../contexts/app.context";

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "black",
  color: "white",
  fontSize: 16,
}));

export default function ArtistManagement() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [socket, setSocket] = useState(null);
  const { profile } = useContext(AppContext);
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
      setLoading(true);
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
  useEffect(() => {
    getArtistApplications();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" color="primary" marginBottom={3}>
        Danh sách đăng kí MKUB Artist
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
                <StyledTableCell>Ngày đăng kí</StyledTableCell>
                <StyledTableCell>Lượt gửi</StyledTableCell>
                <StyledTableCell>Trạng thái</StyledTableCell>
                <StyledTableCell>Lý do</StyledTableCell>
                <StyledTableCell>Hành động</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((row, index) => (
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
                        bgcolor: (theme) => theme.palette.lightGray,
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
      )}

      {/* Modal Chi Tiết */}
      <Modal
        open={!!selectedApplication}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        getArtistApplications={getArtistApplications}
        selectedApplication={selectedApplication}
      ></Modal>
    </Box>
  );
}
