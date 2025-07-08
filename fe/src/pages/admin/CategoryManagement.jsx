import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
import CancelIcon from "@mui/icons-material/Cancel";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://mkhub.s3.us-east-1.amazonaws.com/avatar/default_avt.jpg"
  );
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const {
    reset,
    register,
    setError,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
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
        setOpenModal(false);
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

  const handleClose = () => {
    setOpenAlert(false);
  };

  const handleRequestDelete = (category_id) => {
    setDeleteTargetId(category_id);
    setOpenAlert(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTargetId) return;
    setOpenAlert(true);
    const response = await categoryApis.deleteCategory(deleteTargetId);
    if (response.status === HttpStatusCode.Ok) {
      toast.success(response.data.message, {
        position: "top-center",
      });
      getAllCates();
    }
    setOpenAlert(false);
    setDeleteTargetId(null);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          marginBottom: 2,
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
            setOpenModal(true);
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
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            paddingY: { xs: 2, sm: 3 },
          }}
        >
          <Grid container spacing={2}>
            {categories.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item.id}>
                <Card sx={{ boxShadow: "none", borderRadius: "30px" }}>
                  <CardActionArea
                    sx={{
                      position: "relative",
                      backgroundColor: (theme) => theme.palette.lightGray,
                      borderRadius: "30px",
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        width: 250,
                        height: 300,
                        objectFit: "cover",
                      }}
                      image={item.thumbnail}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingY: 2,
                      }}
                    >
                      <Typography
                        gutterBottom
                        sx={{
                          fontSize: {
                            xs: 14,
                            sm: 18,
                            md: 20,
                          },
                        }}
                        fontWeight={600}
                        textAlign="center"
                      >
                        {item.name}
                      </Typography>
                    </CardContent>
                    <CancelIcon
                      onClick={() => handleRequestDelete(item.id)}
                      sx={{
                        color: "white",
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        borderRadius: "50%",
                        padding: 0.5,
                        cursor: "pointer",
                      }}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
              disabled={isSubmitting}
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Thêm
            </Button>
          </form>
        </Box>
      </Modal>
      <Dialog
        open={openAlert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận trước khi xóa"}
        </DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa chủ đề makeup này?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
