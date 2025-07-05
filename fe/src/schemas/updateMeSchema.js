import * as Yup from "yup";
import { ARTIST_SERVICE_MESSAGES } from "../constants/message";
export const updateMeSchema = Yup.object().shape({
  avatar_url: Yup.mixed()
    .test(
      "fileType",
      ARTIST_SERVICE_MESSAGES.THUMBNAIL_MUST_BE_IMAGE,
      (value) => {
        if (!value) return true;
        return (
          value && (value.type === "image/jpeg" || value.type === "image/png")
        );
      }
    )
    .test(
      "fileSize",
      ARTIST_SERVICE_MESSAGES.THUMBNAIL_SIZE_MUST_BE_LESS_THAN_2_MB,
      (value) => {
        if (!value) return true;
        return value && value.size <= 2 * 1024 * 1024;
      }
    ),
  first_name: Yup.string()
    .min(1, "Họ có độ dài từ 1-50 ký tự")
    .max(50, "Họ có độ dài từ 1-50 ký tự")
    .optional(),
  last_name: Yup.string()
    .min(1, "Họ có độ dài từ 1-50 ký tự")
    .max(50, "Họ có độ dài từ 1-50 ký tự")
    .optional(),
  phone_number: Yup.string()
    .matches(
      /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    )
    .optional(),
  email: Yup.string().email("Email không hợp lệ").optional(),
});
