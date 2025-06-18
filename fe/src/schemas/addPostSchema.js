import * as Yup from "yup";
import { REGISTER_ARTIST_MESSAGE } from "../constants/message";

export const addPostSchema = Yup.object().shape({
  media_url: Yup.array()
    .of(
      Yup.mixed()
        .required(REGISTER_ARTIST_MESSAGE.MEDIA_URL_IS_REQUIRED)
        .test(
          "fileType",
          REGISTER_ARTIST_MESSAGE.MEDIA_URL_TYPE_MUST_BE_IMAGE_OR_VIDEO,
          (value) => {
            return (
              value &&
              ["image/jpeg", "image/png", "video/mp4", "video/webm"].includes(
                value.type
              )
            );
          }
        )
    )
    .min(1, "Media URL không được để trống.")
    .required("Media URL không được để trống."),

  content: Yup.string()
    .min(1, "Nội dung bài đăng phải từ 1-2200 kí tự.")
    .max(2200, "Nội dung bài đăng phải từ 1-2200 kí tự.")
    .optional(),

  // hashtags: Yup.array()
  //   .of(Yup.string().required("Hashtag phải là chuỗi."))
  //   .optional(),
  hashtags: Yup.mixed().notRequired(),
});
