import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import categoryApis from "../../apis/categories.apis";
import HttpStatusCode from "../../constants/httpStatus";
import Skeleton from "../../components/Skeleton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addNewCategorySchema } from "../../schemas/addNewCategorySchema";
import { isAxiosUnprocessableEntityError } from "../../utils/errors.type";
import toast from "react-hot-toast";
import mediaApis from "../../apis/media.apis";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://mkhub.s3.us-east-1.amazonaws.com/avatar/default_avt.jpg"
  );
  const {
    reset,
    register,
    setError,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewCategorySchema),
  });
  const getAllCates = async () => {
    const response = await categoryApis.getAllCategories();
    if (response.status === HttpStatusCode.Ok) {
      setCategories(response.data.result);
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllCates();
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("thumbnail", file, { shouldValidate: true });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleAddNewCategory = async (data) => {
    try {
      const avatarData = watch("thumbnail");
      let avatar_url = avatarData;
      if (avatarData instanceof File) {
        const avatarFormData = new FormData();
        avatarFormData.append("folderName", "category");
        avatarFormData.append("images", avatarData);
        const response = await mediaApis.uploadImage(avatarFormData);
        avatar_url = response.data.result[0];
      }

      const response = await categoryApis.addCategory({
        name: data.name,
        thumbnail: avatar_url,
      });
      if (response.status === HttpStatusCode.Ok) {
        toast.success(response.data.message, {
          position: "top-center",
        });
        reset();
        setPreviewUrl(
          "https://mkhub.s3.us-east-1.amazonaws.com/avatar/default_avt.jpg"
        );
        getAllCates();
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
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          marginTop: 4,
          marginBottom: 8,
          paddingX: 3,
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: 40,
            fontWeight: "600",
            color: (theme) => theme.palette.primary.main,
          }}
        >
          Danh sách chủ đề makeup
        </Typography>
        <Button
          onClick={() => {
            setOpen(true);
          }}
          sx={{
            paddingY: 1,
            paddingX: 2,
            fontWeight: "500",
            color: (theme) => theme.palette.primary.main,
            "&:hover": {
              cursor: "pointer",
              borderRadius: 2,
              bgcolor: (theme) => theme.palette.lightGray,
            },
          }}
        >
          Thêm chủ đề makeup mới +
        </Button>
      </Box>
      {loading ? (
        <Skeleton />
      ) : (
        <Box>
          {" "}
          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              paddingY: { xs: 2, sm: 3 },
            }}
          >
            <Swiper
              spaceBetween={16}
              slidesPerView={4}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                900: { slidesPerView: 4 },
              }}
            >
              {categories.map((item, index) => (
                <SwiperSlide key={index}>
                  <Link
                    to={"/"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card sx={{ width: "100%", boxShadow: "none" }}>
                      <CardActionArea
                        sx={{
                          backgroundColor: (theme) => theme.palette.lightGray,
                          borderRadius: "30px",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="250px"
                          width="250px"
                          sx={{
                            borderRadius: "30px",
                            objectFit: "cover",
                          }}
                          image={item.thumbnail}
                        />
                        <CardContent
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            gutterBottom
                            sx={{
                              fontSize: {
                                xs: 12,
                                sm: 20,
                                md: 20,
                              },
                            }}
                            fontWeight={600}
                          >
                            {item.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "#fff",
            width: 600,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: 40,
              fontWeight: "600",
              marginBottom: 4,
              color: (theme) => theme.palette.primary.main,
            }}
          >
            Thêm chủ đề makeup mới
          </Typography>
          <form
            onSubmit={handleSubmit(handleAddNewCategory)}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              fullWidth
              label="Tên chủ đề makeup"
              size="small"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message || " "}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                "& .MuiFormHelperText-root": {
                  fontSize: "12px",
                  my: "2px",
                },
              }}
            />
            <Avatar
              src={previewUrl}
              alt="Avatar Preview"
              sx={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
            />
            {errors.thumbnail && (
              <Typography color="error" fontSize="14px">
                {errors.thumbnail.message}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Thêm
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
