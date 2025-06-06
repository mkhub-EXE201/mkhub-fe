import * as Yup from "yup";
import { ARTIST_SERVICE_MESSAGES } from "../constants/message";

export const addNewArtistServiceSchema = Yup.object().shape({
  service_name: Yup.string()
    .trim()
    .required(ARTIST_SERVICE_MESSAGES.SERVICE_NAME_NOT_EMPTY),
  category_id: Yup.string().required(
    ARTIST_SERVICE_MESSAGES.CATEGORY_ID_NOT_EMPTY
  ),
  description: Yup.string()
    .trim()
    .required(ARTIST_SERVICE_MESSAGES.SERVICE_DESCRIPTION_NOT_EMPTY)
    .min(
      8,
      ARTIST_SERVICE_MESSAGES.SERVICE_DESCRIPTION_LENGTH_SHOULD_BE_BETWEEN_8_AND_50_CHARACTERS
    ),
  group_size: Yup.number()
    .typeError(ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_MUST_BE_NUMBER)
    .required(ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_NOT_EMPTY)
    .integer(ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_MUST_BE_NUMBER)
    .min(1, ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_IS_INVALID)
    .max(50, ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_IS_INVALID),

  min_price: Yup.number()
    .typeError(ARTIST_SERVICE_MESSAGES.SERVICE_MIN_PRICE_MUST_BE_NUMBER)
    .required(ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_NOT_EMPTY)
    .test(
      "min-less-than-max",
      ARTIST_SERVICE_MESSAGES.SERVICE_MIN_PRICE_MUST_BE_SMALLER_THAN_MAX_PRICE,
      function (value) {
        const { max_price } = this.parent;
        if (value != null && max_price != null) {
          return value <= max_price;
        }
        return true;
      }
    ),

  max_price: Yup.number()
    .typeError(ARTIST_SERVICE_MESSAGES.SERVICE_MIN_PRICE_MUST_BE_NUMBER)
    .required(ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_NOT_EMPTY)
    .test(
      "max-greater-than-min",
      ARTIST_SERVICE_MESSAGES.SERVICE_MIN_PRICE_MUST_BE_SMALLER_THAN_MAX_PRICE,
      function (value) {
        const { min_price } = this.parent;
        if (value != null && min_price != null) {
          return value >= min_price;
        }
        return true;
      }
    ),

  duration: Yup.number()
    .typeError(ARTIST_SERVICE_MESSAGES.SERVICE_MIN_PRICE_MUST_BE_NUMBER)
    .required(ARTIST_SERVICE_MESSAGES.SERVICE_GROUP_SIZE_NOT_EMPTY)
    .min(0, ARTIST_SERVICE_MESSAGES.SERVICE_DURATION_IS_INVALID),

  thumbnail: Yup.mixed()
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
  service_img: Yup.array()
    .of(
      Yup.mixed()
        .required(ARTIST_SERVICE_MESSAGES.SERVICE_IMG_IS_REQUIRED)
        .test(
          "fileType",
          ARTIST_SERVICE_MESSAGES.SERVICE_IMG_TYPE_MUST_BE_IMAGE_OR_VIDEO,
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
    .min(1, ARTIST_SERVICE_MESSAGES.SERVICE_IMG_MUST_BE_AT_LEAST_ONE)
    .max(5, ARTIST_SERVICE_MESSAGES.SERVICE_IMG_MUST_BE_AT_MOST_FIVE),
});
