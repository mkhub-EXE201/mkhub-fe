import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Stack,
  Divider,
  Avatar,
  CircularProgress,
  Link,
  Tooltip,
} from "@mui/material";
import artistApis from "../apis/artists.apis";
import HttpStatusCode from "../constants/httpStatus";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { ARTIST_APPLICATION_STATUS_DISPLAY } from "../constants/enum";
import Footer from "../components/layout/Footer";

export default function RegisterRequest() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const getRegistrationRequests = async () => {
    try {
      const response = await artistApis.getRequests();
      if (response.status === HttpStatusCode.Ok) {
        setRequests(response.data.result || []);
      }
    } catch (error) {
      console.error("Error fetching artist requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRegistrationRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "Thành công";
      case "PENDING":
        return "Đang chờ duyệt";
      case "REJECTED":
        return "Bị Từ chối";
    }
  };

  return (
    <>
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box padding={2}>
          {requests.length > 0 ? (
            requests.map((request) => {
              const {
                id,
                name,
                avatar_url,
                status,
                reason,
                portfolio_url = [],
                media_url = [],
                number_of_submission,
                created_at,
              } = request;

              return (
                <Card
                  key={id}
                  sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={avatar_url} sx={{ width: 64, height: 64 }} />
                    <Box>
                      <Typography variant="h6">{name}</Typography>
                      <Chip
                        label={ARTIST_APPLICATION_STATUS_DISPLAY[status]}
                        color={getStatusColor(status)}
                        size="small"
                        sx={{ mt: 1, fontWeight: 500 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mt={0.5}
                      >
                        Lần nộp: <strong>{number_of_submission}</strong> | Ngày
                        gửi:{" "}
                        <strong>
                          {new Date(created_at).toLocaleDateString()}
                        </strong>
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography fontWeight={600} mb={1}>
                      Portfolio:
                    </Typography>
                    {portfolio_url.length > 0 ? (
                      <Stack spacing={1}>
                        {portfolio_url.map((url, i) => (
                          <Link
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            color="primary"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <InsertLinkIcon fontSize="small" />
                            {url}
                          </Link>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary">
                        Không có liên kết.
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      gap: 0.5,
                      alignItems: "center",
                    }}
                  >
                    <Typography fontWeight={600}>Lý do từ chối:</Typography>
                    <Typography
                      color={
                        status === "REJECTED" ? "error.main" : "text.secondary"
                      }
                    >
                      {reason || "Không có."}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {media_url.length > 0 ? (
                      media_url.map((url, i) => (
                        <Tooltip title={`Ảnh ${i + 1}`} key={i}>
                          <Box
                            component="img"
                            src={url}
                            alt={`media-${i}`}
                            sx={{
                              width: 140,
                              height: 100,
                              borderRadius: 2,
                              objectFit: "cover",
                              boxShadow: 1,
                              transition: "transform 0.3s",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        </Tooltip>
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        Không có hình ảnh đính kèm.
                      </Typography>
                    )}
                  </Box>
                </Card>
              );
            })
          ) : (
            <Box textAlign="center" mt={4}>
              <Typography variant="h6">
                Chưa có yêu cầu đăng ký artist nào.
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Box position={"fixed"} bottom={0} width={"100%"}>
        <Footer />
      </Box>
    </>
  );
}
