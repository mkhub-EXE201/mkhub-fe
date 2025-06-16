import * as Yup from "yup";
import {
  ARTIST_SERVICE_MESSAGES,
  CATEGORY_MESSAGES,
} from "../constants/message";

export const addNewCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required(CATEGORY_MESSAGES.NAME_IS_REQUIRED),

  thumbnail: Yup.mixed()
    .test("fileType", CATEGORY_MESSAGES.THUMBNAIL_IS_REQUIRED, (value) => {
      if (!value) return true;
      return (
        value && (value.type === "image/jpeg" || value.type === "image/png")
      );
    })
    .test(
      "fileSize",
      ARTIST_SERVICE_MESSAGES.THUMBNAIL_SIZE_MUST_BE_LESS_THAN_2_MB,
      (value) => {
        if (!value) return true;
        return value && value.size <= 2 * 1024 * 1024;
      }
    ),
});
