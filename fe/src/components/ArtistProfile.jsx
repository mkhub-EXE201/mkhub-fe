/* eslint-disable react/prop-types */
import React from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateArtistProfileSchema } from "../schemas/updateArtistProfileSchema";

export default function ArtistProfile({ portfolio }) {
  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateArtistProfileSchema),
  });
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 1,
              }}
            >
              Họ tên:
            </Typography>
            <TextField
              required
              {...register("phone_number")}
              size="small"
              fullWidth
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 1,
              }}
            >
              Số điện thoại:
            </Typography>
            <TextField
              required
              value={portfolio.phone_number}
              size="small"
              fullWidth
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: "500",
                marginBottom: 1,
              }}
            >
              Giới thiệu:
            </Typography>
            <TextField
              required
              value={portfolio.bio}
              size="small"
              fullWidth
              multiline
              minRows={5}
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 500, mb: 2 }}>
              Liên kết khác:
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {portfolio.portfolio_url.map((item, index) => (
                <TextField
                  key={index}
                  value={item}
                  size="small"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Link
                        to={item}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                          marginLeft: 8,
                        }}
                      >
                        <Typography variant="body2" color="primary">
                          Sửa
                        </Typography>
                      </Link>
                    ),
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              width={300}
              height={300}
              style={{ borderRadius: "50%", objectFit: "cover" }}
              src={portfolio.avatar_url}
              alt="avatar"
            />
          </Box>
          <Button
            sx={{
              fontSize: 20,
              gap: 1,
              paddingX: 4,
              paddingY: 1,
              alignSelf: "center",
            }}
            onClick={() => {}}
          >
            <AddPhotoAlternateOutlinedIcon />
            Đổi ảnh đại diện
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <Button
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.white,
            paddingX: 4,
            paddingY: 1,
            alignSelf: "center",
          }}
        >
          <Typography>Chỉnh sửa hồ sơ</Typography>
        </Button>
      </Box>
    </>
  );
}
