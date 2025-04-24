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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OnboardingNavBar from "../components/OnboardingNavBar";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { ARTIST_WORKING_LOCATION_TYPE } from "../constants/enum";
import HttpStatusCode from "../constants/httpStatus";
import locationApi from "../apis/location.apis";
import toast from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerArtistSchema } from "../schemas/registerArtistSchema";
import { useForm, Controller } from "react-hook-form";

const steps = [
  "Thông tin artist",
  "Nhận diện độ tin cậy",
  "xây dựng trang cá nhân",
  "Hoàn tất",
];

export default function RegisterArtist() {
  const navigate = useNavigate();
  // state của stepper
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  //state của form
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [profileUrls, setProfileUrls] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerArtistSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      province_id: undefined,
      district_id: undefined,
      ward_code: undefined,
    },
  });

  // Lắng nghe thay đổi province_id từ React Hook Form
  const selectedProvince = watch("province_id");
  const selectedDistrict = watch("district_id");

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
        toast.error("Lỗi lấy danh sách tỉnh/thành phố");
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
        toast.error("Lỗi lấy danh sách quận/huyện");
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
        toast.error("Lỗi lấy danh sách phường/xã");
      }
    };
    getWards();
  }, [selectedDistrict]);

  const handleChangeProfileUrls = (index, value) => {
    const newUrls = [...profileUrls];
    newUrls[index] = value;
    setProfileUrls(newUrls);
  };

  const addProfileUrl = () => {
    setProfileUrls([...profileUrls, ""]);
  };

  const removeProfileUrl = (index) => {
    const newUrls = profileUrls.filter((_, i) => i !== index);
    setProfileUrls(newUrls);
  };

  const handleChangeMediaUrls = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMediaUrls((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Hàm xóa file tại vị trí index
  const removeMediaUrl = (index) => {
    const newUrls = [...mediaUrls];
    newUrls.splice(index, 1);
    setMediaUrls(newUrls);
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    const valid = await trigger();
    if (!valid) return;

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormSubmit = async () => {};

  return (
    <Box>
      <OnboardingNavBar />
      {/* stepper  */}
      <Box sx={{ margin: 10, boxShadow: 2, padding: 2 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
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
              Bước {activeStep + 1}
            </Typography>
            {activeStep === 0 && (
              <>
                {/* form */}
                <form onSubmit={handleFormSubmit} noValidate>
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
                        disabled
                        margin="normal"
                        fullWidth
                        value={"phm.giamy@gmail.com"}
                        onChange={() => {}}
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
                          defaultValue={ARTIST_WORKING_LOCATION_TYPE.HOME}
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
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
                              {provinces.map((p) => (
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
                  {profileUrls.map((_, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                      <TextField
                        sx={{ width: "60%" }}
                        label={`Liên kết ${index + 1}`}
                        value={profileUrls[index]}
                        onChange={(e) =>
                          handleChangeProfileUrls(index, e.target.value)
                        }
                      />
                      <IconButton
                        onClick={() => removeProfileUrl(index)}
                        disabled={profileUrls.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    onClick={addProfileUrl}
                    startIcon={<AddIcon />}
                    sx={{ width: "60%" }}
                    variant="outlined"
                  >
                    Thêm liên kết tài khoản
                  </Button>
                </Box>
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
                  {mediaUrls.map((file, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{ width: "100%" }}
                    >
                      <Typography sx={{ flex: 1 }}>{file.name}</Typography>

                      <IconButton onClick={() => removeMediaUrl(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<AddIcon />}
                    sx={{ width: "60%" }}
                  >
                    Thêm Ảnh/Video
                    <input
                      type="file"
                      accept="image/*,video/*"
                      hidden
                      multiple
                      onChange={(e) => handleChangeMediaUrls(e)}
                    />
                  </Button>
                </Box>
              </>
            )}
            {/* {activeStep === 3 && (
              <Box px={5} py={2}>
                <Typography variant="h6">Xác nhận thông tin</Typography>
                <Box component="dl" my={2}>
                  <dt>Họ tên:</dt>
                  <dd>{artistName}</dd>
                  <dt>Số điện thoại:</dt>
                  <dd>{phoneNumber}</dd>
                  <dt>Loại địa chỉ:</dt>
                  <dd>
                    {addressType === ARTIST_WORKING_LOCATION_TYPE.HOME
                      ? "Nhà riêng"
                      : "Studio"}
                  </dd>
                  {addressType === ARTIST_WORKING_LOCATION_TYPE.STUDIO && (
                    <>
                      <dt>Tên studio:</dt>
                      <dd>{addressName}</dd>
                    </>
                  )}
                  <dt>Địa chỉ chi tiết:</dt>
                  <dd>
                    {`${wards.find((w) => w.WardCode.toString() === selectedWard)?.WardName}, `}
                    {`${districts.find((d) => d.DistrictID.toString() === selectedDistrict)?.DistrictName}, `}
                    {`${districts.find((p) => p.ProvinceID.toString() === selectedProvince)?.ProvinceName}, `}
                    {streetName}
                  </dd>
                  <dt>Liên kết MXH:</dt>
                  <dd>
                    <ul>
                      {profileUrls.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </dd>
                  <dt>Media:</dt>
                  <dd>
                    <ul>
                      {mediaUrls.map((f, i) => (
                        <li key={i}>{f.name}</li>
                      ))}
                    </ul>
                  </dd>
                </Box>
                <Button
                  variant="contained"
                  onClick={async () => {
                    const payload = {
                      name: artistName,
                      phone_number: phoneNumber,
                      portfolio_url: profileUrls,
                      bio: "",
                      avatar_url: "",
                      address_type: addressType,
                      location_name: addressName,
                      ward_code: Number(selectedWard),
                      district_id: Number(selectedDistrict),
                      province_id: Number(selectedProvince),
                      street_name: streetName,
                      media_url: mediaUrls, // or processed URLs
                    };
                    try {
                      // await yourApi.registerArtist(payload);
                      toast.success("Đăng ký thành công!");
                      navigate("/");
                    } catch (e) {
                      toast.error("Đăng ký thất bại, thử lại.");
                    }
                  }}
                >
                  Gửi hồ sơ
                </Button>
              </Box>
            )} */}
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

              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Hoàn tất" : "Tiếp tục"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
