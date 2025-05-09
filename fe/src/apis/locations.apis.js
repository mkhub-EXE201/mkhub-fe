import http from "../utils/http";

const locationUrl = "/locations";
const locationApi = {
  async getProvinces() {
    return await http.get(`${locationUrl}/provinces`);
  },
  async getDistricts(province_id) {
    return await http.get(`${locationUrl}/districts`, {
      params: {
        province_id,
      },
    });
  },
  async getWards(districtId) {
    return await http.get(`${locationUrl}/wards`, {
      params: { district_id: districtId },
    });
  },
  async getWardNameByCode(wardCode, district_id) {
    return await http.get(
      `${locationUrl}/wards/${wardCode}?district_id=${district_id}`
    );
  },

  getDistrictNameByCode: (districtId, province_id) =>
    http.get(
      `${locationUrl}/districts/${districtId}?province_id=${province_id}`
    ),
  getProvinceNameByCode: (provinceId) =>
    http.get(`${locationUrl}/provinces/${provinceId}`),
};
export default locationApi;
