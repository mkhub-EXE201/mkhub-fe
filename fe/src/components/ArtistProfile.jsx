/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateArtistProfileSchema } from "../schemas/updateArtistProfileSchema";
import artistApis from "../apis/artists.apis";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { isAxiosUnprocessableEntityError } from "../utils/errors.type";
import mediaApis from "../apis/media.apis";
import { AppContext } from "../contexts/app.context";

export default function ArtistProfile({ portfolio }) {
  console.log(portfolio);
  const { setProfile: setContextProfile } = useContext(AppContext);
  const [editableIndex, setEditableIndex] = useState(null);
  const [urls, setUrls] = useState(
    Array.isArray(portfolio.portfolio_url) ? [...portfolio.portfolio_url] : []
  );
  const [originalUrls, setOriginalUrls] = useState(
    Array.isArray(portfolio.portfolio_url) ? [...portfolio.portfolio_url] : []
  );
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (portfolio?.avatar_url) {
      setPreviewUrl(portfolio.avatar_url);
    }
  }, [portfolio?.avatar_url]);
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleEditClick = (index) => {
    if (editableIndex === index) {
      const resetUrls = [...urls];
      resetUrls[index] = originalUrls[index];
      setUrls(resetUrls);
      setValue("portfolio_urls", resetUrls);
      setEditableIndex(null);
    } else {
      setEditableIndex(index);
    }
  };

  const handleUrlChange = (e, index) => {
    const newUrls = [...urls];
    newUrls[index] = e.target.value;
    setUrls(newUrls);
    setValue("portfolio_urls", newUrls);
  };
  const {
    register,
    setError,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateArtistProfileSchema),
    defaultValues: {
      name: portfolio.name,
      bio: portfolio.bio,
      email: portfolio.email,
      phone_number: portfolio.phone_number,
      portfolio_urls: urls,
    },
  });
  useEffect(() => {
    if (portfolio) {
      const initialUrls = Array.isArray(portfolio.portfolio_url)
        ? [...portfolio.portfolio_url]
        : [];
      setUrls(initialUrls);
      setOriginalUrls(initialUrls);
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
    if (selectedFile) {
      const avatarFormData = new FormData();
      avatarFormData.append("folderName", "profile");
      avatarFormData.append("images", selectedFile);
      const resUpload = await mediaApis.uploadImage(avatarFormData);
      if (resUpload.status === HttpStatusCode.Ok) {
        setValue("avatar_url", ...resUpload.data.result);
      }
    }
    const payload = {
      name: watch("name"),
      bio: watch("bio"),
      email: watch("email"),
      phone_number: watch("phone_number"),
      portfolio_url: watch("portfolio_urls"),
      avatar_url: watch("avatar_url"),
    };
    try {
      const response = await artistApis.updateArtistProfile(
        portfolio.id,
        payload
      );
      if (response.status === HttpStatusCode.Ok) {
        // update hủy -> sửa
        const updatedUrls = watch("portfolio_urls");
        setOriginalUrls([...updatedUrls]);
        setUrls([...updatedUrls]);
        setEditableIndex(null);
        setContextProfile((prev) => ({
          ...prev,
          ...response.data.result,
          artist_avatar_url: response.data.result.avatar_url,
        }));
        // toast
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

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file);
    if (file) {
      setValue("avatar_url", file, { shouldValidate: true });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: 2,
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
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
            InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
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
              src={previewUrl}
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
            onClick={() => fileInputRef.current?.click()}
          >
            <AddPhotoAlternateOutlinedIcon />
            Đổi ảnh đại diện
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
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
            minWidth: 250,
            ":hover": {
              opacity: 0.9,
            },
            ":disabled": {
              bgcolor: (theme) => theme.palette.primary.main,
              color: (theme) => theme.palette.white,
              cursor: "not-allowed",
            },
          }}
          disabled={isSubmitting}
          onClick={handleUpdate}
          type="submit"
        >
          {isSubmitting ? (
            <Box display={"flex"} gap={1} alignItems={"center"}>
              <CircularProgress color="'white" size={16} />
              <Typography>Đang cập nhật...</Typography>
            </Box>
          ) : (
            <Typography>Chỉnh sửa hồ sơ</Typography>
          )}
        </Button>
      </Box>
    </>
  );
}
