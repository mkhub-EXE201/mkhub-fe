import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Modal as MuiModal,
  Fade,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Backdrop,
  TextField,
  Avatar,
  IconButton,
  CardActions,
  CardContent,
  CardMedia,
  Card,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
  Grid,
} from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addNewArtistServiceSchema } from "../../schemas/addNewArtistServiceSchema";
import { useDropzone } from "react-dropzone";
import RemoveIcon from "@mui/icons-material/Remove";
import artistServiceApis from "../../apis/artistServices.apis";
import HttpStatusCode from "../../constants/httpStatus";
import toast from "react-hot-toast";
import mediaApis from "../../apis/media.apis";
import { formatCurrency } from "../../utils/utils";
import { AppContext } from "../../contexts/app.context";
import Skeleton from "../../components/Skeleton";
import categoryApis from "../../apis/categories.apis";

export default function ArtistServiceManagement() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const { profile } = useContext(AppContext);
  const getAllCategories = async () => {
    const response = await categoryApis.getAllCategories();
    if (response.status === HttpStatusCode.Ok) {
      setCategories(response.data.result);
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  const {
    register,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewArtistServiceSchema),
    defaultValues: {
      service_name: "",
      category_id: "",
      description: "",
      duration: 0,
      group_size: 0,
      max_price: 0,
      min_price: 0,
      thumbnail: "",
      service_img: [],
    },
  });
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(
    "https://mkhub.s3.us-east-1.amazonaws.com/avatar/default_avt.jpg"
  );
  const steps = [
    "Thông tin cơ bản",
    "Hình ảnh mô tả",
    "Xác nhận trước khi gửi",
  ];

  const getOneServices = async () => {
    try {
      const response = await artistServiceApis.getOneAllServices(
        profile.artist_id
      );
      if (response.status === HttpStatusCode.Ok) {
        setServices(response.data.result);
      }
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOneServices();
  }, []);
  const handleNext = async () => {
    let stepFields = [];
    if (activeStep === 0) {
      stepFields = [
        "service_name",
        "description",
        "duration",
        "group_size",
        "thumbnail",
        "max_price",
        "min_price",
      ];
    } else if (activeStep === 1) {
      stepFields = ["service_img"];
    }
    if (stepFields.length > 0) {
      const isStepValid = await trigger(stepFields);
      if (!isStepValid) return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("thumbnail", file, { shouldValidate: true });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async () => {
    try {
      // upload thumbnail
      const avatarFormData = new FormData();
      avatarFormData.append("folderName", "services_thumbnails");
      avatarFormData.append("images", watch("thumbnail"));
      let response = await mediaApis.uploadImage(avatarFormData);
      const thumbnail = response.data.result[0];
      // upload service_img
      const files = watch("service_img") || [];
      const serviceMediaFormData = new FormData();
      serviceMediaFormData.append("folderName", "services");
      files.forEach((file) => {
        serviceMediaFormData.append("images", file);
      });
      response = await mediaApis.uploadImage(serviceMediaFormData);
      const service_img = response.data.result;
      console.log(service_img);
      const payload = {
        service_name: watch("service_name"),
        category_id: watch("category_id"),
        description: watch("description"),
        group_size: Number(watch("group_size")),
        min_price: Number(watch("min_price")),
        max_price: Number(watch("max_price")),
        duration: Number(watch("duration")),
        thumbnail,
        service_img,
      };
      console.log(payload);
      response = await artistServiceApis.addNewService(payload);
      if (response.status === HttpStatusCode.Ok) {
        toast.success(response.data.result.message);
        handleClose();
        getOneServices();
      }
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    }
  };

  const onDrop = (acceptedFiles) => {
    const currentFiles = watch("service_img") || [];
    const currentPreview = watch("service_img_preview") || [];
    const mappedFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Tạo ảnh preview
    }));
    setValue("service_img", [...currentFiles, ...acceptedFiles]);
    setValue("service_img_preview", [...currentPreview, ...mappedFiles], {
      shouldValidate: true,
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });
  const handleRemoveFile = (index) => {
    const files = watch("service_img") || [];
    const previewFiles = watch("service_img_preview") || [];
    const newFiles = [...files];
    const newPreviewFiles = [...previewFiles];
    if (newPreviewFiles[index]?.preview) {
      URL.revokeObjectURL(newPreviewFiles[index].preview);
    }
    newFiles.splice(index, 1);
    newPreviewFiles.splice(index, 1);
    setValue("service_img", newFiles);
    setValue("service_img_preview", newPreviewFiles);
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ padding: 3 }}>
          <Skeleton />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              marginTop: 4,
              marginBottom: 8,
              marginX: 2,
              alignItems: "center",
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
              Gói makeup của bạn
            </Typography>

            <Button onClick={handleOpen}>
              <Typography
                sx={{
                  paddingY: 1,
                  paddingX: 2,
                  fontWeight: "500",
                  color: (theme) => theme.palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    borderRadius: 2,
                  },
                }}
              >
                Thêm gói makeup mới +
              </Typography>
            </Button>
          </Box>
          <MuiModal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={open}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 800,
                  maxHeight: "90vh",
                  overflowY: "auto",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography id="modal-title" variant="h6" component="h2">
                    Thêm gói makeup mới
                  </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                      const stepProps = {};
                      const labelProps = {};

                      return (
                        <Step key={index} {...stepProps}>
                          <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>

                  <Box sx={{ mt: 4 }}>
                    {activeStep === 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Typography>Ảnh bìa</Typography>
                        <Avatar
                          src={previewUrl}
                          alt="Avatar Preview"
                          sx={{
                            width: 150,
                            height: 150,
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
                        <TextField
                          fullWidth
                          label="Tên gói makeup"
                          variant="outlined"
                          {...register("service_name")}
                          error={!!errors.service_name}
                          helperText={errors.service_name?.message || " "}
                        />

                        <Controller
                          name="category_id"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.category_id}>
                              <Select
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value="">Chọn chủ đề makeup</MenuItem>
                                {categories &&
                                  categories.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                      {item.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                              <FormHelperText>
                                {errors.category_id?.message}
                              </FormHelperText>
                            </FormControl>
                          )}
                        />

                        <TextField
                          fullWidth
                          label="Mô tả gói dịch vụ"
                          variant="outlined"
                          {...register("description")}
                          error={!!errors.description}
                          helperText={errors.description?.message || " "}
                        />
                        <TextField
                          fullWidth
                          label="Số lượng người tối đa cho 1 buổi makeup"
                          variant="outlined"
                          {...register("group_size")}
                          type="number"
                          error={!!errors.group_size}
                          helperText={errors.group_size?.message || " "}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Giá trị tối thiểu của gói makeup"
                            variant="outlined"
                            {...register("min_price")}
                            error={!!errors.min_price}
                            helperText={errors.min_price?.message || " "}
                          />
                          <TextField
                            fullWidth
                            label="Giá trị tối đa của gói makeup"
                            variant="outlined"
                            {...register("max_price")}
                            error={!!errors.max_price}
                            helperText={errors.max_price?.message || " "}
                          />
                        </Box>
                      </Box>
                    )}
                    {activeStep === 1 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          rowGap: 2,
                          paddingX: 5,
                          paddingY: 2,
                        }}
                      >
                        <Box
                          {...getRootProps()}
                          sx={{
                            border: "2px dashed gray",
                            p: 2,
                            textAlign: "center",
                            borderRadius: 2,
                          }}
                        >
                          <input {...getInputProps()} />
                          <Typography>
                            Nhấn hoặc kéo thả hình ảnh/video vào đây
                          </Typography>
                        </Box>

                        <Box
                          mt={2}
                          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
                        >
                          {watch("service_img_preview")?.map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 120,
                                height: 120,
                                position: "relative",
                              }}
                            >
                              {item?.file?.type?.startsWith("image/") ? (
                                <>
                                  <img
                                    src={item.preview}
                                    alt="preview"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveFile(index)}
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      right: 0,
                                      bgcolor: "white",
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                </>
                              ) : item?.file?.type?.startsWith("video/") ? (
                                <>
                                  <video
                                    src={item.preview}
                                    controls
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveFile(index)}
                                    sx={{
                                      position: "absolute",
                                      top: 0,
                                      right: 0,
                                      bgcolor: "white",
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                </>
                              ) : (
                                <Typography>Không xác định</Typography>
                              )}
                            </Box>
                          ))}
                        </Box>

                        {errors.media_urls && (
                          <Typography color="error" mt={1}>
                            {errors.media_urls.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                    {activeStep === 2 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Typography variant="h6">Xác nhận thông tin</Typography>

                        <Typography>
                          <strong>Tên gói:</strong> {watch("service_name")}
                        </Typography>
                        <Typography>
                          <strong>Mô tả:</strong> {watch("description")}
                        </Typography>
                        <Typography>
                          <strong>Số lượng người tối đa:</strong>{" "}
                          {watch("group_size")}
                        </Typography>
                        <Typography>
                          <strong>Giá tối thiểu:</strong> {watch("min_price")}{" "}
                          VNĐ
                        </Typography>
                        <Typography>
                          <strong>Giá tối đa:</strong> {watch("max_price")} VNĐ
                        </Typography>

                        <Box>
                          <Typography>
                            <strong>Ảnh thumbnail:</strong>
                          </Typography>
                          <Avatar
                            src={previewUrl}
                            sx={{ width: 150, height: 150 }}
                          />
                        </Box>

                        <Box>
                          <Typography>
                            <strong>Hình ảnh mô tả:</strong>
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 2,
                            }}
                          >
                            {watch("service_img_preview")?.map(
                              (item, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    position: "relative",
                                  }}
                                >
                                  {item?.file?.type?.startsWith("image/") ? (
                                    <img
                                      src={item.preview}
                                      alt="preview"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: 8,
                                      }}
                                    />
                                  ) : (
                                    <video
                                      src={item.preview}
                                      controls
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: 8,
                                      }}
                                    />
                                  )}
                                </Box>
                              )
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Nút Tiếp theo / Quay lại */}
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={
                        activeStep === steps.length ? handleSubmit : handleNext
                      }
                      sx={{ mr: 1 }}
                    >
                      {activeStep === steps.length ? "Gửi" : "Tiếp theo"}
                    </Button>
                    <Button onClick={handleBack} disabled={activeStep === 0}>
                      Quay lại
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Fade>
          </MuiModal>
          <Box
            sx={{
              marginX: 4,
            }}
          >
            <Grid container disableGutters spacing={2} justifyContent="center">
              {services.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      width: "250px",
                      height: "350px",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "15px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="150"
                      image={item.thumbnail}
                      alt={item.service_name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {item.service_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          fontSize: 13,
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Typography
                        sx={{ mt: 2, fontWeight: "600", fontSize: 14 }}
                      >
                        Từ {formatCurrency(item.min_price)} -{" "}
                        {formatCurrency(item.max_price)} VND
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                    >
                      <Button size="small" variant="outlined">
                        Chỉnh sửa
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </Box>
  );
}
