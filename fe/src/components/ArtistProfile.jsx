/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateArtistProfileSchema } from "../schemas/updateArtistProfileSchema";
import artistApis from "../apis/artists.apis";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { isAxiosUnprocessableEntityError } from "../utils/errors.type";

export default function ArtistProfile({ portfolio }) {
  const [editableIndex, setEditableIndex] = useState(null);
  const [urls, setUrls] = useState([...portfolio.portfolio_url]);
  const [originalUrls] = useState([...portfolio.portfolio_url]);

  const handleEditClick = (index) => {
    if (editableIndex === index) {
      const revertedUrls = [...urls];
      revertedUrls[index] = originalUrls[index];
      setUrls(revertedUrls);
      setEditableIndex(null);
    } else {
      setEditableIndex(index);
    }
  };
  const handleUrlChange = (e, index) => {
    const newUrls = [...urls];
    newUrls[index] = e.target.value;
    setUrls(newUrls);
  };
  const {
    register,
    setError,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateArtistProfileSchema),
  });
  useEffect(() => {
    if (portfolio) {
      reset({
        name: portfolio.name || "",
        bio: portfolio.bio || "",
        email: portfolio.email || "",
        phone_number: portfolio.phone_number || "",
        portfolio_urls: portfolio.portfolio_url || [],
      });
    }
  }, [portfolio, reset]);
  const handleUpdate = handleSubmit(async () => {
    const payload = {
      name: watch("name"),
      bio: watch("bio"),
      email: watch("email"),
      phone_number: watch("phone_number"),
      portfolio_url: watch("portfolio_urls"),
    };
    try {
      const response = await artistApis.updateArtistProfile(
        portfolio.id,
        payload
      );
      if (response.status === HttpStatusCode.Ok) {
        toast.success(response.data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      if (isAxiosUnprocessableEntityError(error)) {
        const formError = error.response.data.errors;
        Object.keys(formError).forEach((key) => {
          setError(key, {
            type: "Server",
            message: formError[key],
          });
        });
      }
    }
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
            <TextField
              required
              label="Họ tên:"
              {...register("name")}
              size="small"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message || " "}
            />
          </Box>
          <Box>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Số điện thoại: "
              {...register("phone_number")}
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message || " "}
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
              variant="outlined"
              margin="normal"
              label="Giới thiệu: "
              fullWidth
              multiline
              minRows={3}
              {...register("bio")}
              error={!!errors.bio}
              helperText={errors.bio?.message || " "}
            />
          </Box>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="email"
            {...register("email")}
            disabled
            sx={{ cursor: "not-allowed" }}
            error={!!errors.email}
            helperText={errors.email?.message || " "}
          />
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
              {urls.map((item, index) => (
                <TextField
                  key={index}
                  value={item}
                  size="small"
                  fullWidth
                  onChange={(e) => handleUrlChange(e, index)}
                  InputProps={{
                    readOnly: editableIndex !== index,
                    endAdornment: (
                      <Link
                        onClick={() => handleEditClick(index)}
                        component="button"
                        variant="body2"
                        sx={{ marginLeft: 1 }}
                      >
                        {editableIndex === index ? "Hủy" : "Sửa"}
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
          onClick={handleUpdate}
          type="submit"
        >
          <Typography>Chỉnh sửa hồ sơ</Typography>
        </Button>
      </Box>
    </>
  );
}
