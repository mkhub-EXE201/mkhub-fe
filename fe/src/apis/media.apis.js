import http from "../utils/http";

export const mediaUrl = "media";

const mediaApis = {
  uploadImage: (formData) =>
    http.post(`${mediaUrl}/upload-images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    }),
};
export default mediaApis;
