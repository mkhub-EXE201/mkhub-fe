import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  FormHelperText,
  Stack,
  Avatar,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import OnboardingNavBar from "../components/OnboardingNavBar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { ARTIST_WORKING_LOCATION_TYPE } from "../constants/enum";
import HttpStatusCode from "../constants/httpStatus";
import locationApi from "../apis/locations.apis";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerArtistSchema } from "../schemas/registerArtistSchema";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ADDRESS_MESSAGE } from "../constants/message";
import { useDropzone } from "react-dropzone";
import RemoveIcon from "@mui/icons-material/Remove";
import mediaApis from "../apis/media.apis";
import artistApis from "../apis/artists.apis";
import path from "../constants/path";
const steps = [
  "Thông tin artist",
  "Nhận diện độ tin cậy",
  "Xây dựng trang cá nhân",
  "Hoàn tất",
];
const stepDescriptions = [
  "Nhập thông tin cá nhân và địa chỉ làm việc của bạn",
  "Thêm các liên kết portfolio của bạn",
  "Tải lên hình ảnh hoặc video mẫu về công việc của bạn",
  "Xác nhận thông tin trước khi gửi",
];

export default function RegisterArtist() {
  const navigate = useNavigate();
  // state của stepper
  const [activeStep, setActiveStep] = useState(0);

  //state của form
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(
    "https://mkhub.s3.us-east-1.amazonaws.com/avatar/default_avt.jpg"
  );
  const [isSumitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    trigger,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerArtistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      address_type: ARTIST_WORKING_LOCATION_TYPE.HOME,
      province_id: undefined,
      district_id: undefined,
      ward_code: undefined,
      portfolio_urls: [""],
      media_urls: [],
    },
  });

  // Lắng nghe thay đổi province_id từ React Hook Form
  const selectedProvince = watch("province_id");
  const selectedDistrict = watch("district_id");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getProvinces = async () => {
      const response = await locationApi.getProvinces();
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setProvinces(data);
        setValue("district_id", undefined);
        setValue("ward_code", undefined);
        setWards([]);
      } else {
        toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_PROVINCES);
      }
    };
    getProvinces();
  }, []);

  useEffect(() => {
    const getDistricts = async () => {
      if (!selectedProvince) return;

      const response = await locationApi.getDistricts(Number(selectedProvince));
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setDistricts(data);
        setValue("district_id", undefined);
        setValue("ward_code", undefined);
        setWards([]);
      } else {
        toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_DISTRICTS);
      }
    };
    getDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const getWards = async () => {
      if (!selectedDistrict) return;
      const response = await locationApi.getWards(Number(selectedDistrict));
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setWards(data);
        setValue("ward_code", undefined);
      } else {
        toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_WARDS);
      }
    };
    getWards();
  }, [selectedDistrict]);

  const handleNext = async () => {
    let stepFields = [];
    if (activeStep === 0) {
      stepFields = [
        "name",
        "phone_number",
        "address_type",
        "email",
        "location_name",
        "province_id",
        "district_id",
        "ward_code",
        "street_name",
      ];
    } else if (activeStep === 1) {
      const portfolioFields = (watch("portfolio_urls") || []).map(
        (_, index) => `portfolio_urls.${index}`
      );
      stepFields = portfolioFields;
      stepFields =
        portfolioFields.length > 0 ? portfolioFields : ["portfolio_urls"];
    } else if (activeStep === 2) {
      stepFields = ["media_urls"];
    }
    const isStepValid = await trigger(stepFields);
    if (!isStepValid) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    // 1. upload avatar
    const avatarData = getValues("avatar_url");
    let avatar_url = avatarData;

    if (avatarData instanceof File) {
      const avatarFormData = new FormData();
      avatarFormData.append("folderName", "avatar");
      avatarFormData.append("images", avatarData);
      const response = await mediaApis.uploadImage(avatarFormData);
      avatar_url = response.data.result[0];
    }

    // 2. upload ảnh làm profile
    const files = watch("media_urls") || [];
    const profileMediaFormData = new FormData();
    profileMediaFormData.append("folderName", "profile");
    files.forEach((file) => {
      profileMediaFormData.append("images", file);
    });
    await mediaApis.uploadImage(profileMediaFormData);

    let response = await mediaApis.uploadImage(profileMediaFormData);
    const profileMedia = response.data.result;
    const payload = {
      name: watch("name"),
      phone_number: watch("phone_number"),
      ...(avatar_url && { avatar_url }),
      portfolio_url: watch("portfolio_urls"),
      media_url: profileMedia,
      address_type: watch("address_type"),
      location_name: watch("location_name"),
      street_name: watch("street_name"),
      ward_code: watch("ward_code"),
      district_id: watch("district_id"),
      province_id: watch("province_id"),
      email: watch("email"),
    };

    response = await artistApis.registerArtist(payload);
    if (response.status === HttpStatusCode.Ok) {
      setIsSubmitting(false);
      toast.success(response.data.message);
      navigate(path.login);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolio_urls",
  });

  const onDrop = (acceptedFiles) => {
    const currentFiles = watch("media_urls") || [];
    const currentPreview = watch("media_urls_preview") || [];
    // Map file mới và tạo ảnh preview cho mỗi file
    const mappedFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Tạo ảnh preview
    }));
    // Cập nhật lại media_urls và media_urls_preview
    setValue("media_urls", [...currentFiles, ...acceptedFiles]);
    setValue("media_urls_preview", [...currentPreview, ...mappedFiles], {
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
    const files = watch("media_urls") || [];
    const previewFiles = watch("media_urls_preview") || [];
    const newFiles = [...files];
    const newPreviewFiles = [...previewFiles];
    if (newPreviewFiles[index]?.preview) {
      URL.revokeObjectURL(newPreviewFiles[index].preview);
    }
    newFiles.splice(index, 1);
    newPreviewFiles.splice(index, 1);
    setValue("media_urls", newFiles);
    setValue("media_urls_preview", newPreviewFiles);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("avatar_url", file, { shouldValidate: true });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Box>
      <OnboardingNavBar content={"Đăng kí trở thành Makeup Artist"} />
      {/* stepper  */}
      <Box sx={{ margin: 10, boxShadow: 2, padding: 2 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={() => navigate("/")}>Trang chủ</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ mt: 3, mb: 1, paddingX: 2 }}>
              Bước {activeStep + 1}: {stepDescriptions[activeStep]}
            </Typography>
            {activeStep === 0 && (
              <>
                {/* form */}
                <form onSubmit={onSubmit} noValidate>
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
                    {/* avatar - optional */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Typography>Ảnh đại diện</Typography>
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
                      {errors.avatar_url && (
                        <Typography color="error" fontSize="14px">
                          {errors.avatar_url.message}
                        </Typography>
                      )}
                    </Box>
                    {/* input 1: họ tên artist */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Họ tên</label>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message || " "}
                      />
                    </Box>
                    {/* input 2: sđt artist */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Số điện thoại</label>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("phone_number")}
                        error={!!errors.phone_number}
                        helperText={errors.phone_number?.message || " "}
                      />
                    </Box>
                    {/* input 3: email artist */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Email</label>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message || " "}
                      />
                    </Box>
                    {/* input 4: location working type của artist */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Loại địa chỉ</label>
                      <FormControl fullWidth error={!!errors.address_type}>
                        <Select
                          value={watch("address_type")}
                          {...register("address_type")}
                        >
                          <MenuItem value={ARTIST_WORKING_LOCATION_TYPE.HOME}>
                            Nhà riêng
                          </MenuItem>
                          <MenuItem value={ARTIST_WORKING_LOCATION_TYPE.STUDIO}>
                            Studio
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    {/* input 5: location working name của artist nếu có */}
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Tên studio</label>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        disabled={watch("address_type") === "HOME"}
                        error={!!errors.location_name}
                        helperText={errors.location_name?.message}
                        {...register("location_name")}
                      />
                    </FormControl>

                    {/* input 6: location: province */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Tỉnh/Thành phố</label>
                      <Controller
                        name="province_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.province_id}>
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              displayEmpty
                            >
                              <MenuItem value="">Chọn Tỉnh/Thành phố</MenuItem>
                              {provinces &&
                                provinces.map((p) => (
                                  <MenuItem
                                    key={p.ProvinceID}
                                    value={p.ProvinceID}
                                  >
                                    {p.ProvinceName}
                                  </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                              {errors.province_id?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Box>
                    {/* input 7: location: district */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Quận/Huyện</label>
                      <Controller
                        name="district_id"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.district_id}>
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              displayEmpty
                            >
                              <MenuItem value="">Chọn Quận/Huyện</MenuItem>
                              {districts.map((p) => (
                                <MenuItem
                                  key={p.DistrictID}
                                  value={p.DistrictID}
                                >
                                  {p.DistrictName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.district_id?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Box>

                    {/* input 8: location: ward */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Phường/Xã</label>
                      <Controller
                        name="ward_code"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.ward_code}>
                            <Select
                              {...field}
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              displayEmpty
                            >
                              <MenuItem value="">Chọn Phường/Xã</MenuItem>
                              {wards.map((p) => (
                                <MenuItem key={p.WardCode} value={p.WardCode}>
                                  {p.WardName}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {errors.ward_code?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Box>

                    {/* input 8: location: street name */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <label style={{ width: "20%" }}>Số & Tên đường</label>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("street_name")}
                        error={!!errors.street_name}
                        helperText={errors.street_name?.message || " "}
                      />
                    </Box>
                  </Box>
                </form>
              </>
            )}
            {activeStep === 1 && (
              <>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
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
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "60%" }}
                        label={`Liên kết ${index + 1}`}
                        {...register(`portfolio_urls.${index}`)}
                        error={Boolean(errors.portfolio_urls?.[index])}
                        helperText={errors.portfolio_urls?.[index]?.message}
                      />
                      <IconButton
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                <Button
                  onClick={() => append("")}
                  startIcon={<AddIcon />}
                  sx={{ width: "60%" }}
                  variant="outlined"
                >
                  Thêm liên kết tài khoản
                </Button>
                {errors.portfolio_urls?.message && (
                  <Typography color="error">
                    {errors.portfolio_urls?.message}
                  </Typography>
                )}
              </>
            )}
            {activeStep === 2 && (
              <>
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
                    {watch("media_urls_preview")?.map((item, index) => (
                      <Box
                        key={index}
                        sx={{ width: 120, height: 120, position: "relative" }}
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
              </>
            )}
            {activeStep === 3 && (
              <Box px={5} py={3}>
                <Stack spacing={2} mt={2}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography>Ảnh đại diện</Typography>
                    <Avatar
                      src={previewUrl}
                      alt="Avatar Preview"
                      sx={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Họ tên:
                    </Typography>
                    <Typography>{watch("name")}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Số điện thoại:
                    </Typography>
                    <Typography>{watch("phone_number")}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Loại địa chỉ:
                    </Typography>
                    <Typography>
                      {watch("address_type") ===
                      ARTIST_WORKING_LOCATION_TYPE.HOME
                        ? "Nhà riêng"
                        : "Studio"}
                    </Typography>
                  </Box>
                  {watch("address_type") ===
                    ARTIST_WORKING_LOCATION_TYPE.STUDIO && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="subtitle2" color="textSecondary">
                        Tên studio:
                      </Typography>
                      <Typography>{watch("location_name")}</Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="textSecondary">
                      Địa chỉ cụ thể:
                    </Typography>
                    <Typography>
                      {[
                        watch("street_name"),
                        wards.find(
                          (w) => Number(w.WardCode) === watch("ward_code")
                        )?.WardName,
                        districts.find(
                          (d) => d.DistrictID === watch("district_id")
                        )?.DistrictName,
                        provinces.find(
                          (p) => p.ProvinceID === watch("province_id")
                        )?.ProvinceName,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Liên kết tài khoản khác:
                    </Typography>
                    <Stack
                      component="ul"
                      sx={{ listStyle: "disc", pl: 2 }}
                      spacing={0.5}
                    >
                      {watch("portfolio_urls")?.map((url, index) => (
                        <Typography
                          key={index}
                          component="li"
                          variant="body2"
                          sx={{
                            "& a": {
                              color: "text.primary",
                              textDecoration: "none",
                              transition: "all 0.2s",
                            },
                            "& a:hover": {
                              color: "primary.main",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Hình ảnh/video về layout makeup bạn đã thực hiện
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" mt={1}>
                      {watch("media_urls_preview")?.map((file, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 120,
                            height: 120,
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "#f0f0f0",
                          }}
                        >
                          {file?.file?.type?.startsWith("image/") ? (
                            <img
                              src={file.preview}
                              alt={`preview-${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : file?.file?.type?.startsWith("video/") ? (
                            <video
                              src={file.preview}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              controls
                            />
                          ) : (
                            <Typography variant="body2" p={1}>
                              Không xác định
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>

                <Box mt={4} display="flex" justifyContent="center"></Box>
              </Box>
            )}

            {/* navigation button: quay lại & tiếp tục */}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Quay lại
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              {activeStep == steps.length - 1 ? (
                <Button
                  variant="contained"
                  size="large"
                  disabled={isSumitting}
                  onClick={() => onSubmit()}
                >
                  Gửi hồ sơ
                </Button>
              ) : (
                <Button onClick={handleNext}>Hoàn tất</Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
