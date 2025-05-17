/* eslint-disable react/prop-types */
import {
  Modal as MuiModal,
  Box,
  Typography,
  Fade,
  Backdrop,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDateTime, getStatusColor } from "../utils/utils";
import {
  ARTIST_APPLICATION_STATUS,
  ARTIST_APPLICATION_STATUS_DISPLAY,
  ARTIST_WORKING_LOCATION_TYPE_DISPLAY,
} from "../constants/enum";
import { useState, useEffect } from "react";
import locationApi from "../apis/locations.apis";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyArtistSchema } from "../schemas/verifyArtistSchema";
import adminApis from "../apis/admin.apis";
import toast from "react-hot-toast";
import HttpStatusCode from "../constants/httpStatus";

export default function Modal({ open, onClose, selectedApplication }) {
  const [wardName, setWardName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [provinceName, setProvinceName] = useState("");

  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifyArtistSchema),
    defaultValues: {
      verify_status: "",
      reason: "",
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: "Thông tin cá nhân" },
    { label: "Nhận diện độ tin cậy" },
    { label: "Xây dựng trang cá nhân" },
  ];

  if (selectedApplication?.status === ARTIST_APPLICATION_STATUS.PENDING) {
    steps.push({ label: "Duyệt đơn" });
  }

  useEffect(() => {
    const getLocationName = async () => {
      try {
        const [wardRes, districtRes, provinceRes] = await Promise.all([
          locationApi.getWardNameByCode(
            selectedApplication.ward_code,
            selectedApplication.district_id
          ),
          locationApi.getDistrictNameByCode(
            selectedApplication.district_id,
            selectedApplication.province_id
          ),
          locationApi.getProvinceNameByCode(selectedApplication.province_id),
        ]);

        setWardName(wardRes.data.result);
        setDistrictName(districtRes.data.result);
        setProvinceName(provinceRes.data.result);
      } catch (error) {
        console.error("Failed to fetch location names:", error);
      }
    };

    if (selectedApplication) {
      getLocationName();
    }
  }, [selectedApplication]);

  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (steps.length === 4 && activeStep === 3) {
      const stepFields = ["reason", "verify_status"];
      const isStepValid = await trigger(stepFields);
      if (!isStepValid) return;
    }

    try {
      const response = await adminApis.verifyArtistApplication(
        selectedApplication.id,
        {
          status: watch("verify_status"),
          reason: watch("reason"),
        }
      );
      if (response.status === HttpStatusCode.Ok) {
        toast.success(response.data.message);
      }
      await adminApis.getArtistApplicationsByStatus("");
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    }
  };
  return (
    <div>
      <MuiModal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
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
                Thông tin chi tiết
              </Typography>
              <Chip
                label={
                  ARTIST_APPLICATION_STATUS_DISPLAY[selectedApplication?.status]
                }
                sx={{
                  marginY: 1,
                  paddingX: 2,
                  fontWeight: "600",
                  color: "white",
                  bgcolor: getStatusColor(selectedApplication?.status),
                }}
              />
            </Box>
            selectedApplication?.status
            {/* Stepper ở dưới phần thông tin */}
            <Box sx={{ mt: 4 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      optional={
                        index === steps.length - 1 ? (
                          <Typography variant="caption">
                            Bước cuối cùng
                          </Typography>
                        ) : null
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      {activeStep === 0 && (
                        <Box>
                          {selectedApplication && (
                            <Box
                              sx={{
                                mt: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <Avatar
                                src={selectedApplication.avatar_url}
                                alt="Avatar Preview"
                                sx={{
                                  width: 200,
                                  height: 200,
                                  borderRadius: "50%",
                                  mb: 2,
                                }}
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  disabled={true}
                                  id="outlined-basic"
                                  label="Tên"
                                  variant="outlined"
                                  value={selectedApplication.name}
                                />
                                <TextField
                                  fullWidth
                                  disabled={true}
                                  id="outlined-basic"
                                  label="Số điện thoại"
                                  variant="outlined"
                                  value={selectedApplication.phone_number}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: 400 }}
                                  disabled={true}
                                  id="outlined-basic"
                                  label="Email"
                                  variant="outlined"
                                  value={selectedApplication.email}
                                />
                                <TextField
                                  sx={{ width: 400 }}
                                  disabled={true}
                                  id="outlined-basic"
                                  label="Ngày đăng kí"
                                  variant="outlined"
                                  value={formatDateTime(
                                    selectedApplication.created_at
                                  )}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  sx={{ width: 400 }}
                                  disabled={true}
                                  id="outlined-basic"
                                  label="Số lượt gửi"
                                  variant="outlined"
                                  value={
                                    selectedApplication.number_of_submission
                                  }
                                />
                                <TextField
                                  sx={{ width: 400 }}
                                  disabled={true}
                                  id="outlined-basic"
                                  label="Nơi Làm việc"
                                  variant="outlined"
                                  value={
                                    ARTIST_WORKING_LOCATION_TYPE_DISPLAY[
                                      selectedApplication.address_type
                                    ]
                                  }
                                />
                              </Box>
                              <TextField
                                fullWidth
                                disabled
                                id="outlined-basic"
                                label="Địa chỉ"
                                variant="outlined"
                                value={`${selectedApplication.street_name}, ${wardName}, ${districtName}, ${provinceName}`}
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                      {activeStep === 1 && (
                        <Box>
                          {selectedApplication && (
                            <>
                              {selectedApplication.portfolio_url.map((item) => (
                                <Box key={item} sx={{ marginY: 2 }}>
                                  <TextField
                                    fullWidth
                                    disabled
                                    id="outlined-basic"
                                    label="Liên kết tài khoản"
                                    variant="outlined"
                                    value={item}
                                  />
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      )}
                      {activeStep === 2 && (
                        <Box sx={{ mt: 2 }}>
                          {selectedApplication && (
                            <Grid container spacing={2}>
                              {selectedApplication.media_url.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src={item}
                                      alt="Uploaded"
                                      width={200}
                                      height={200}
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: 8,
                                      }}
                                    />
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          )}
                        </Box>
                      )}

                      {activeStep === 3 && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <FormControl fullWidth error={!!errors.verify_status}>
                            <InputLabel id="verify-status-label">
                              Trạng thái phê duyệt
                            </InputLabel>
                            <Select
                              labelId="verify-status-label"
                              id="verify-status"
                              value={watch("verify_status")}
                              label="Trạng thái phê duyệt"
                              {...register("verify_status")}
                            >
                              <MenuItem
                                value={ARTIST_APPLICATION_STATUS.REJECTED}
                              >
                                Từ chối
                              </MenuItem>
                              <MenuItem
                                value={ARTIST_APPLICATION_STATUS.APPROVED}
                              >
                                Duyệt
                              </MenuItem>
                            </Select>
                            {errors.verify_status && (
                              <FormHelperText>
                                {errors.verify_status.message}
                              </FormHelperText>
                            )}
                          </FormControl>

                          <TextField
                            fullWidth
                            id="reason"
                            label="Lý do"
                            value={watch("reason")}
                            error={!!errors.reason}
                            helperText={errors.reason?.message}
                            {...register("reason")}
                          />
                        </Box>
                      )}

                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (
                              index === steps.length - 1 &&
                              steps.length === 4
                            ) {
                              handleSubmit();
                            } else {
                              handleNext();
                            }
                          }}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 && steps.length === 4
                            ? "Hoàn thành"
                            : "Tiếp theo"}
                        </Button>

                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Quay lại
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {/* {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                </Paper>
              )} */}
            </Box>
          </Box>
        </Fade>
      </MuiModal>
    </div>
  );
}
