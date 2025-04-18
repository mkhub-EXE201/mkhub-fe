import http from "../utils/http";

const locationUrl = "/locations";
const locationApi = {
  async getProvinces() {
    return await http.get(`${locationUrl}/provinces`);
  },
  async getDistricts(provinceId) {
    return await http.post(`${locationUrl}/districts`, {
      province_id: provinceId,
    });
  },
  async getWards(districtId) {
    return await http.post(`${locationUrl}/wards`, { district_id: districtId });
  },
};
export default locationApi;
