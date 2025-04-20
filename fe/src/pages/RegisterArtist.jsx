import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
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
  const [addressType, setAddressType] = useState(
    ARTIST_WORKING_LOCATION_TYPE.HOME
  );
  //state của form
  const [addressName, setAddressName] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [streetName, setStreetName] = useState("");
  const [profileUrls, setProfileUrls] = useState([]);
  const [mediaUrls, setMediaUrls] = useState([]);

  useEffect(() => {
    const getProvinces = async () => {
      const response = await locationApi.getProvinces();
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setProvinces(data);
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
        setSelectedDistrict("");
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
        setSelectedWard("");
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

  const handleNext = () => {
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
            <Typography sx={{ mt: 2, mb: 1 }}>Bước {activeStep + 1}</Typography>
            {activeStep === 0 && (
              <>
                {/* form */}
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
                      value={""}
                      onChange={() => {}}
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
                      value={""}
                      onChange={() => {}}
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
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "60%",
                    }}
                  >
                    <label style={{ width: "20%" }}>Loại địa chỉ</label>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={addressType}
                      fullWidth
                      onChange={(e) => setAddressType(e.target.value)}
                    >
                      <MenuItem value={ARTIST_WORKING_LOCATION_TYPE.HOME}>
                        Nhà riêng
                      </MenuItem>
                      <MenuItem value={ARTIST_WORKING_LOCATION_TYPE.STUDIO}>
                        Studio
                      </MenuItem>
                    </Select>
                  </FormControl>
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
                      disabled={
                        addressType === ARTIST_WORKING_LOCATION_TYPE.HOME
                      }
                      margin="normal"
                      fullWidth
                      value={addressName}
                      onChange={
                        addressType === ARTIST_WORKING_LOCATION_TYPE.STUDIO
                          ? (e) => setAddressName(e.target.value)
                          : () => {}
                      }
                    />
                  </FormControl>
                  {/* input 6: location: province */}
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "60%",
                    }}
                  >
                    <label style={{ width: "20%" }}>Tỉnh/Thành phố</label>
                    <Select
                      labelId="demo-simple-select-label"
                      value={selectedProvince ?? ""}
                      fullWidth
                      onChange={(e) =>
                        setSelectedProvince(Number(e.target.value))
                      }
                    >
                      {provinces &&
                        provinces.length > 0 &&
                        provinces.map((province) => (
                          <MenuItem
                            key={province.ProvinceID}
                            value={province.ProvinceID.toString()}
                          >
                            {province.ProvinceName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {/* input 7: location: district */}
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "60%",
                    }}
                  >
                    <label style={{ width: "20%" }}>Quận/Huyện</label>
                    <Select
                      labelId="demo-simple-select-label"
                      value={selectedDistrict ?? ""}
                      fullWidth
                      onChange={(e) =>
                        setSelectedDistrict(Number(e.target.value))
                      }
                    >
                      {districts &&
                        districts.length > 0 &&
                        districts.map((district) => (
                          <MenuItem
                            key={district.DistrictID}
                            value={district.DistrictID.toString()}
                          >
                            {district.DistrictName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  {/* input 8: location: ward */}
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: "60%",
                    }}
                  >
                    <label style={{ width: "20%" }}>Phường/Xã</label>
                    <Select
                      labelId="demo-simple-select-label"
                      value={selectedWard ?? ""}
                      fullWidth
                      onChange={(e) => setSelectedWard(Number(e.target.value))}
                    >
                      {wards &&
                        wards.length > 0 &&
                        wards.map((ward) => (
                          <MenuItem
                            key={ward.WardCode}
                            value={ward.WardCode.toString()}
                          >
                            {ward.WardName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
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
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                    />
                  </Box>
                </Box>
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
