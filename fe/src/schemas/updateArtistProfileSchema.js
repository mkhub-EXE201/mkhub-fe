import * as Yup from "yup";
import {
  REGISTER_ARTIST_MESSAGE,
  UPDATE_ARTIST_PROFILE_MESSAGES,
} from "../constants/message";

export const updateArtistProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, "Tên có độ dài từ 1-50 ký tự")
    .max(50, "Họ có độ dài từ 1-50 ký tự")
    .optional(),
  phone_number: Yup.string()
    .matches(
      /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    )
    .optional(),
  email: Yup.string()
    .trim()
    .email(UPDATE_ARTIST_PROFILE_MESSAGES.EMAIL_IS_INVALID)
    .optional(),
  bio: Yup.string().trim().optional(),
  portfolio_urls: Yup.array()
    .of(Yup.string().url(REGISTER_ARTIST_MESSAGE.PORTFOLIO_IS_INVALID))
    .test(
      "unique",
      REGISTER_ARTIST_MESSAGE.PORTFOLIO_URL_HAS_EXISTED,
      (value) => {
        if (!value) return true;
        const filtered = value.filter((v) => v && v.trim() !== "");
        const uniqueSet = new Set(filtered.map((v) => v.trim().toLowerCase()));
        return uniqueSet.size === filtered.length;
      }
    )
    .min(1, REGISTER_ARTIST_MESSAGE.PORTFOLIO_URL_MUST_BE_AT_LEAST_ONE)
    .max(5, REGISTER_ARTIST_MESSAGE.PORTFOLIO_URL_MUST_BE_AT_MOST_FIVE),
  avatar_url: Yup.mixed()
    .test(
      "fileType",
      REGISTER_ARTIST_MESSAGE.AVATAR_URL_MUST_BE_IMAGE,
      (value) => {
        if (!value) return true;
        return (
          value && (value.type === "image/jpeg" || value.type === "image/png")
        );
      }
    )
    .test(
      "fileSize",
      REGISTER_ARTIST_MESSAGE.AVATAR_URL_SIZE_MUST_BE_LESS_THAN_2_MB,
      (value) => {
        if (!value) return true;
        return value && value.size <= 2 * 1024 * 1024;
      }
    ),
});
