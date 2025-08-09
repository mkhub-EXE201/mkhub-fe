/* eslint-disable react/prop-types */
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Backdrop,
  Box,
  Fade,
  Modal,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BOOKING_ADDRESS_TYPE } from "../constants/enum";
import locationApi from "../apis/locations.apis";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { ADDRESS_MESSAGE } from "../constants/message";
import { formatCurrency } from "../utils/utils";
import bookingApis from "../apis/bookings.apis";
import BookingCalendar from "../components/BookingCalendar";
import addNewBookingSchema from "../schemas/addNewBookingSchema";
import artistLocationApis from "../apis/artistLocations.apis";

export default function BookingModal({
  currentModal,
  closeModal,
  user,
  artistId,
  artistProfile,
  selectedService,
}) {
  const steps = [
    "Chọn lịch trình",
    "Thông tin bổ sung",
    "Xác nhận trước khi gửi",
  ];

  const {
    register,
    setError,
    handleSubmit,
    trigger,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewBookingSchema),
    defaultValues: {
      bookingSchedule: null,
      bookingStartTime: null,
      bookingEndTime: null,
      address_type: "",
      street_name: null,
      ward_code: null,
      district_id: null,
      province_id: null,
      address_id: "",
      artist_phone: null,
      artist_id: artistId,
      client_id: user?.id ?? null,
      client_phone: user?.phone_number ?? null,
      client_note: null,
      group_size: 1,
      service_id: null,
      total_price: null,
    },
  });

  // state các step booking
  const [bookingSchedule, setBookingSchedule] = useState(null);
  const [bookingStartTime, setBookingStartTime] = useState(null);
  const [bookingEndTime, setBookingEndTime] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardName, setWardName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [provinceName, setProvinceName] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Lắng nghe thay đổi từ React Hook Form
  const addressType = watch("address_type");
  const selectedProvince = watch("province_id");
  const selectedDistrict = watch("district_id");
  const selectedAddressId = watch("address_id");
  const [artistAddresses, setArtistAddresses] = useState([]);

  const getArtistAddresses = async () => {
    const response =
      await artistLocationApis.getArtistWorkingLocations(artistId);
    if (response.status === HttpStatusCode.Ok) {
      const locations = await Promise.all(
        response.data.result.map(async (location) => {
          const ward = await getWardNameByCode(
            location.ward_code,
            location.district_id
          );
          const district = await getDistrictNameByCode(
            location.district_id,
            location.province_id
          );
          const province = await getProvinceNameByCode(location.province_id);
          return {
            ...location,
            ward_name: ward.data.result,
            district_name: district.data.result,
            province_name: province.data.result,
          };
        })
      );
      setArtistAddresses(locations);
    }
  };

  useEffect(() => {
    getArtistAddresses();
    getProvinces();
  }, []);

  // Effect cho client address - load districts khi chọn province
  useEffect(() => {
    const getDistricts = async () => {
      if (
        !selectedProvince ||
        addressType !== BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS
      )
        return;

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
  }, [selectedProvince, addressType, setValue]);

  // Effect cho client address - load wards khi chọn district
  useEffect(() => {
    const getWards = async () => {
      if (
        !selectedDistrict ||
        addressType !== BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS
      )
        return;

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
  }, [selectedDistrict, addressType, setValue]);

  // Effect để reset form khi chuyển address type
  useEffect(() => {
    if (addressType === BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS) {
      setValue("address_id", "");
      setValue("province_id", undefined);
      setValue("district_id", undefined);
      setValue("ward_code", undefined);
      setValue("street_name", "");
      setWardName(null);
      setDistrictName(null);
      setProvinceName(null);
    } else if (addressType === BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS) {
      setValue("province_id", undefined);
      setValue("district_id", undefined);
      setValue("ward_code", undefined);
      setValue("street_name", "");
      setWardName(null);
      setDistrictName(null);
      setProvinceName(null);
    }
  }, [addressType, setValue]);

  // Effect để set địa chỉ khi chọn artist address
  useEffect(() => {
    if (
      addressType === BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS &&
      selectedAddressId
    ) {
      const selectedAddress = artistAddresses.find(
        (addr) => addr.id === selectedAddressId
      );

      if (selectedAddress) {
        console.log("Setting artist address:", selectedAddress);

        // Set tất cả thông tin địa chỉ
        setValue("street_name", selectedAddress.street_name);
        setValue("province_id", Number(selectedAddress.province_id));
        setValue("district_id", Number(selectedAddress.district_id));
        setValue("ward_code", Number(selectedAddress.ward_code));

        // Set display names
        setWardName(selectedAddress.ward_name);
        setDistrictName(selectedAddress.district_name);
        setProvinceName(selectedAddress.province_name);

        console.log("Set values:", {
          street_name: selectedAddress.street_name,
          province_id: Number(selectedAddress.province_id),
          district_id: Number(selectedAddress.district_id),
          ward_code: Number(selectedAddress.ward_code),
        });
      }
    }
  }, [selectedAddressId, artistAddresses, addressType, setValue]);

  const getProvinces = async () => {
    const response = await locationApi.getProvinces();
    if (response.status === HttpStatusCode.Ok) {
      const data = response.data.result;
      setProvinces(data);
    } else {
      toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_PROVINCES);
    }
  };

  const getWardNameByCode = async (wardCode, district_id) => {
    return await locationApi.getWardNameByCode(wardCode, district_id);
  };

  const getDistrictNameByCode = async (districtId, province_id) => {
    return await locationApi.getDistrictNameByCode(districtId, province_id);
  };

  const getProvinceNameByCode = async (provinceId) => {
    return await locationApi.getProvinceNameByCode(provinceId);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = async () => {
    let stepFields = [];
    if (activeStep === 0) {
      stepFields = ["bookingSchedule", "bookingStartTime", "bookingEndTime"];
    } else if (activeStep === 1) {
      setValue("artist_phone", artistProfile.phone_number);
      setValue("artist_id", artistProfile.id);
      setValue("service_id", selectedService.id);
      setValue("total_price", selectedService.max_price);

      // Validate fields based on address type
      if (addressType === BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS) {
        stepFields = ["address_type", "address_id"];
      } else if (addressType === BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS) {
        stepFields = [
          "address_type",
          "province_id",
          "district_id",
          "ward_code",
          "street_name",
        ];
      }
    }

    if (stepFields.length > 0) {
      const isStepValid = await trigger(stepFields);
      if (!isStepValid) return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSubmitBooking = async () => {
    try {
      console.log("Submitting booking with data:", {
        province_id: watch("province_id"),
        district_id: watch("district_id"),
        ward_code: watch("ward_code"),
        street_name: watch("street_name"),
        address_type: watch("address_type"),
        address_id: watch("address_id"),
      });

      const response = await bookingApis.addBookingRequest({
        client_id: watch("client_id"),
        client_phone: watch("client_phone"),
        artist_id: watch("artist_id"),
        artist_phone: watch("artist_phone"),
        service_id: watch("service_id"),
        address_type: watch("address_type"),
        province_id: Number(watch("province_id")),
        district_id: Number(watch("district_id")),
        ward_code: Number(watch("ward_code")),
        street_name: watch("street_name"),
        client_note: watch("client_note"),
        address_id: watch("address_id"),
        group_size: watch("group_size"),
        total_price: watch("total_price"),
        booking_date: new Date(watch("bookingSchedule").start)
          .toISOString()
          .split("T")[0],
        start_time: `${watch("bookingSchedule")?.start.toISOString().split("T")[0]}T${watch("bookingStartTime")}:00`,
        end_time: `${watch("bookingSchedule")?.start.toISOString().split("T")[0]}T${watch("bookingEndTime")}:00`,
      });

      if (response?.status === HttpStatusCode.Ok) {
        toast.success(response.data.message);
        reset();
        closeModal();
      } else {
        toast.error("Đặt lịch thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      toast.error("Có lỗi xảy ra khi đặt lịch!");
    }
  };

  return (
    <Modal
      open={currentModal === "booking"}
      onClose={closeModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={currentModal === "booking"}>
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
              Đặt lịch hẹn
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
                <>
                  <BookingCalendar
                    register={register}
                    watch={watch}
                    setError={setError}
                    setValue={setValue}
                    errors={errors}
                    trigger={trigger}
                    service={selectedService}
                    bookingSchedule={bookingSchedule}
                    setBookingSchedule={setBookingSchedule}
                    bookingStartTime={bookingStartTime}
                    bookingEndTime={bookingEndTime}
                    setBookingStartTime={setBookingStartTime}
                    setBookingEndTime={setBookingEndTime}
                  />

                  {bookingEndTime && (
                    <>
                      <Typography>
                        Thời gian bắt đầu: {bookingStartTime}{" "}
                        {bookingSchedule.start.toLocaleDateString("vi-VN")}
                      </Typography>
                      <Typography>
                        Dự kiến kết thúc: {bookingEndTime}{" "}
                        {bookingSchedule.end.toLocaleDateString("vi-VN")}
                      </Typography>
                    </>
                  )}
                </>
              )}

              {activeStep === 1 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: 2,
                  }}
                >
                  <TextField
                    fullWidth
                    label={"Tên gói makeup"}
                    value={selectedService.service_name}
                    disabled
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
                      label={"Tên Artist"}
                      value={artistProfile.name}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label={"Số điện thoại Artist"}
                      value={artistProfile.phone_number}
                      disabled
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
                      fullWidth
                      label={"Tên người đặt"}
                      value={`${user.last_name} ${user.first_name}`}
                      disabled
                    />
                    <TextField
                      fullWidth
                      label={"Số điện thoại người đặt"}
                      placeholder="Số điện thoại người đặt"
                      value={`${user.phone_number}`}
                      disabled
                    />
                  </Box>

                  {/* Address Type Selection */}
                  <Controller
                    name="address_type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.address_type}>
                        <InputLabel id="address-type-label">
                          Loại địa chỉ đặt hẹn
                        </InputLabel>
                        <Select
                          labelId="address-type-label"
                          id="address-type"
                          label="Loại địa chỉ đặt hẹn"
                          {...field}
                          value={field.value || ""}
                        >
                          <MenuItem value={BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS}>
                            Địa chỉ của artist
                          </MenuItem>
                          <MenuItem value={BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS}>
                            Địa chỉ của khách hàng
                          </MenuItem>
                        </Select>
                        <FormHelperText>
                          {errors.address_type?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  {/* Artist Address Selection */}
                  {addressType === BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS && (
                    <Controller
                      name="address_id"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.address_id}>
                          <InputLabel id="artist-address-label">
                            Chọn địa chỉ artist
                          </InputLabel>
                          <Select
                            labelId="artist-address-label"
                            label="Chọn địa chỉ artist"
                            {...field}
                            value={field.value || ""}
                          >
                            {artistAddresses.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.street_name}
                                {", "}
                                {item.ward_name}
                                {", "}
                                {item.district_name}
                                {", "}
                                {item.province_name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>
                            {errors.address_id?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  )}

                  {/* Client Address Form */}
                  {addressType === BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS && (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                          gap: 2,
                        }}
                      >
                        {/* Province */}
                        <Controller
                          name="province_id"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.province_id}>
                              <InputLabel id="province-label">
                                Tỉnh/Thành phố
                              </InputLabel>
                              <Select
                                labelId="province-label"
                                id="province"
                                label="Tỉnh/Thành phố"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              >
                                <MenuItem value="">
                                  <em>Chọn Tỉnh/Thành phố</em>
                                </MenuItem>
                                {provinces?.map((p) => (
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

                        {/* District */}
                        <Controller
                          name="district_id"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.district_id}>
                              <InputLabel id="district-label">
                                Quận/Huyện
                              </InputLabel>
                              <Select
                                labelId="district-label"
                                id="district"
                                label="Quận/Huyện"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              >
                                <MenuItem value="">
                                  <em>Chọn Quận/Huyện</em>
                                </MenuItem>
                                {districts.map((d) => (
                                  <MenuItem
                                    key={d.DistrictID}
                                    value={d.DistrictID}
                                  >
                                    {d.DistrictName}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {errors.district_id?.message}
                              </FormHelperText>
                            </FormControl>
                          )}
                        />

                        {/* Ward */}
                        <Controller
                          name="ward_code"
                          control={control}
                          render={({ field }) => (
                            <FormControl fullWidth error={!!errors.ward_code}>
                              <InputLabel id="ward-label">Phường/Xã</InputLabel>
                              <Select
                                labelId="ward-label"
                                id="ward"
                                label="Phường/Xã"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              >
                                <MenuItem value="">
                                  <em>Chọn Phường/Xã</em>
                                </MenuItem>
                                {wards.map((w) => (
                                  <MenuItem key={w.WardCode} value={w.WardCode}>
                                    {w.WardName}
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

                      <TextField
                        label="Số & Tên đường"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        {...register("street_name")}
                        error={!!errors.street_name}
                        helperText={errors.street_name?.message || " "}
                      />
                    </>
                  )}

                  <TextField
                    fullWidth
                    label="Ghi chú của khách hàng dành cho artist (nếu có)"
                    placeholder="Da mình treatment có bong tróc"
                    {...register("client_note")}
                    error={!!errors.client_note}
                    helperText={errors.client_note?.message || " "}
                  />

                  <TextField
                    fullWidth
                    label="Tổng chi phí makeup"
                    sx={{ cursor: "not-allowed" }}
                    value={`${formatCurrency(selectedService.max_price)} VNĐ`}
                    disabled
                  />

                  <Controller
                    name="group_size"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Số lượng khách"
                        fullWidth
                        inputProps={{
                          min: 1,
                          max: selectedService?.group_size ?? 1,
                        }}
                        error={!!errors.group_size}
                        helperText={errors.group_size?.message}
                      />
                    )}
                  />

                  {/* Debug info for development */}
                  {/* {process.env.NODE_ENV === "development" && (
                    <Box sx={{ p: 2, bgcolor: "grey.100", fontSize: "12px" }}>
                      <div>Debug Info:</div>
                      <div>Address Type: {watch("address_type")}</div>
                      <div>Address ID: {watch("address_id")}</div>
                      <div>Province ID: {watch("province_id")}</div>
                      <div>District ID: {watch("district_id")}</div>
                      <div>
                        Ward Code: {watch("ward_code")} (
                        {typeof watch("ward_code")})
                      </div>
                      <div>Street Name: {watch("street_name")}</div>
                      <div>Ward Name: {wardName}</div>
                      <div>District Name: {districtName}</div>
                      <div>Province Name: {provinceName}</div>
                    </Box>
                  )} */}
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>
                    Thông tin buổi Makeup
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Ngày đặt hẹn"
                        value={
                          bookingSchedule?.start?.toLocaleDateString("vi-VN") ||
                          ""
                        }
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="Giờ bắt đầu:"
                        value={watch("bookingStartTime") || ""}
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="Giờ kết thúc dự kiến"
                        value={watch("bookingEndTime") || ""}
                        disabled
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Ghi chú của khách hàng"
                      value={watch("client_note") || "Không có"}
                      disabled
                    />
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Số lượng người đặt makeup"
                        value={watch("group_size")}
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="Tổng chi phí"
                        value={`${formatCurrency(watch("total_price"))} VNĐ`}
                        disabled
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Đặt lịch hẹn makeup tại"
                      value={
                        watch("address_type") ===
                        BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS
                          ? "Studio của Artist"
                          : "Địa chỉ của khách hàng"
                      }
                      disabled
                    />
                    <TextField
                      fullWidth
                      label="Địa chỉ cụ thể"
                      value={
                        watch("street_name") &&
                        (wardName || districtName || provinceName)
                          ? `${watch("street_name")}, ${wardName || "N/A"}, ${districtName || "N/A"}, ${provinceName || "N/A"}`
                          : "Chưa có thông tin địa chỉ"
                      }
                      disabled
                    />
                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                      Thông tin người đặt & Artist
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Tên Artist"
                        value={artistProfile.name}
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="Số điện thoại Artist"
                        value={watch("artist_phone") || ""}
                        disabled
                      />
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Tên Khách hàng"
                        value={`${user.last_name} ${user.first_name}`}
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="Số điện thoại khách hàng"
                        value={watch("client_phone") || ""}
                        disabled
                      />
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
                  activeStep === steps.length - 1
                    ? handleSubmit(handleSubmitBooking)
                    : handleNext
                }
                sx={{ mr: 1 }}
              >
                {activeStep === steps.length - 1 ? "Gửi" : "Tiếp theo"}
              </Button>
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Quay lại
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
