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
    return await http.post(`${locationUrl}/wards`, { district_id: districtId });
  },
};
export default locationApi;
