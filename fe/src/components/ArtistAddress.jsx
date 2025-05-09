import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";

import toast from "react-hot-toast";
import locationApi from "../apis/locations.apis";
import artistLocationApis from "../apis/artistLocations.apis";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { artistAddressSchema } from "../schemas/artistAddressSchema";
import { ARTIST_WORKING_LOCATION_TYPE } from "../constants/enum";
import { ADDRESS_MESSAGE } from "../constants/message";
import HttpStatusCode from "../constants/httpStatus";

export default function ArtistAddress() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isAdded, setIsAdded] = useState(true);
  const {
    register,
    setError,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(artistAddressSchema),
    defaultValues: {
      address_type: ARTIST_WORKING_LOCATION_TYPE.HOME,
      province_id: undefined,
      district_id: undefined,
      ward_code: undefined,
      location_name: "",
      street_name: "",
      is_default: false,
    },
  });

  const selectedProvince = watch("province_id");
  const selectedDistrict = watch("district_id");

  const getWorkingLocations = async () => {
    return await locationApi.getArtistWorkingLocations();
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

  useEffect(() => {
    const getAllArtistLocations = async () => {
      try {
        const response = await artistLocationApis.getArtistWorkingLocations();

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
        console.log(locations);
        setLocations(locations);
      } catch (error) {
        toast.error(error.message || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getAllArtistLocations();
  }, []);

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

  return (
    <Box sx={{ padding: 2, marginTop: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* title */}
          <Typography
            sx={{
              fontSize: 25,
              fontWeight: "600",
              marginY: 3,
              color: (theme) => theme.palette.darkPink,
            }}
          >
            Thêm mới địa chỉ làm việc
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              marginY: 3,
              color: (theme) => theme.palette.mediumGray,
            }}
          >
            Vui lòng xác nhận các nội dung bên dưới
          </Typography>
          <Box>
            {/* form add & update */}
            <form>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                <TextField
                  fullWidth
                  label="Tên studio"
                  {...register("location_name")}
                  error={!!errors.street_nlocation_nameame}
                  helperText={errors.location_name?.message || " "}
                />
                <Controller
                  name="province_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.province_id}>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        displayEmpty
                      >
                        <MenuItem value="">Chọn Tỉnh/Thành phố</MenuItem>
                        {provinces.map((p) => (
                          <MenuItem key={p.ProvinceID} value={p.ProvinceID}>
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
                <Controller
                  name="district_id"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.district_id}>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        displayEmpty
                      >
                        <MenuItem value="">Chọn Quận/Huyện</MenuItem>
                        {districts.map((d) => (
                          <MenuItem key={d.DistrictID} value={d.DistrictID}>
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
                <Controller
                  name="ward_code"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.ward_code}>
                      <Select
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        displayEmpty
                      >
                        <MenuItem value="">Chọn Phường/Xã</MenuItem>
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
                <TextField
                  label="Số nhà, tên đường"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  {...register("street_name")}
                  error={!!errors.street_name}
                  helperText={errors.street_name?.message || " "}
                />
                <Controller
                  name="is_default"
                  control={control}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup
                        {...field}
                        value={field.value ?? false}
                        onChange={(e) =>
                          field.onChange(e.target.value === "true")
                        }
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Chọn làm địa chỉ mặc định"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                <Button type="submit" fullWidth variant={"contained"}>
                  {isAdded ? "Thêm mới" : "Cập nhật"}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Box sx={{ flex: 1 }}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width={400} height={110} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton width="60%" height={30} sx={{ mt: 1 }} />
                <Skeleton width={300} height={30} />
              </Box>
            </>
          ) : (
            locations.map((location) => (
              <Box
                key={location.id}
                sx={{
                  border: "1px solid #ED1E79",
                  px: 4,
                  py: 5,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 400,
                    }}
                  >
                    {location.street_name}, {location.ward_name},{" "}
                    {location.district_name}, {location.province_name}
                  </Typography>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    width="30"
                    height="30"
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Box>
                {location.is_default && (
                  <Chip
                    label="Địa chỉ mặc định"
                    color="primary"
                    variant="outlined"
                    sx={{
                      backgroundColor: (theme) => theme.palette.lightPink,
                      color: (theme) => theme.palette.darkPink,
                      borderColor: (theme) => theme.palette.lightPink,
                      marginTop: 1,
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  />
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
