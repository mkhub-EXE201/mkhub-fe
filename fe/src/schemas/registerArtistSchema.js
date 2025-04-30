import * as Yup from "yup";
import { REGISTER_ARTIST_MESSAGE } from "../constants/message";
import { ARTIST_WORKING_LOCATION_TYPE } from "../constants/enum";

export const registerArtistSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(REGISTER_ARTIST_MESSAGE.NAME_IS_REQUIRED)
    .typeError(REGISTER_ARTIST_MESSAGE.NAME_MUST_BE_STRING)
    .min(1, REGISTER_ARTIST_MESSAGE.NAME_MUST_BE_BETWEEN_1_AND_30)
    .max(30, REGISTER_ARTIST_MESSAGE.NAME_MUST_BE_BETWEEN_1_AND_30)
    .matches(/^[\p{L}\s]+$/u, REGISTER_ARTIST_MESSAGE.NAME_IS_INVALID),

  phone_number: Yup.string()
    .trim()
    .required(REGISTER_ARTIST_MESSAGE.PHONE_NUMBER_IS_REQUIRED)
    .typeError(REGISTER_ARTIST_MESSAGE.PHONE_NUMBER_IS_INVALID)
    .matches(
      /^(?:84|0)(3|5|7|8|9)\d{8}$/,
      REGISTER_ARTIST_MESSAGE.PHONE_NUMBER_IS_INVALID
    ),

  address_type: Yup.string()
    .required(REGISTER_ARTIST_MESSAGE.ADDRESS_TYPE_IS_REQUIRED)
    .oneOf(
      ["HOME", "STUDIO"],
      REGISTER_ARTIST_MESSAGE.ADDRESS_TYPE_MUST_BE_HOME_OR_STUDIO
    ),

  location_name: Yup.string()
    .when("address_type", {
      is: ARTIST_WORKING_LOCATION_TYPE.STUDIO,
      then: (schema) =>
        schema
          .required(REGISTER_ARTIST_MESSAGE.LOCATION_NAME_IS_REQUIRED)
          .min(
            1,
            REGISTER_ARTIST_MESSAGE.LOCATION_NAME_MUST_BE_BETWEEN_1_AND_30
          )
          .max(
            30,
            REGISTER_ARTIST_MESSAGE.LOCATION_NAME_MUST_BE_BETWEEN_1_AND_30
          )
          .matches(
            /^[\p{L}\s]+$/u,
            REGISTER_ARTIST_MESSAGE.STUDIO_NAME_IS_INVALID
          ),
      otherwise: (schema) => schema.optional(),
    })
    .typeError(REGISTER_ARTIST_MESSAGE.LOCATION_NAME_MUST_BE_STRING),

  province_id: Yup.number().required(
    REGISTER_ARTIST_MESSAGE.PROVINCE_IS_REQUIRED
  ),

  district_id: Yup.number().required(
    REGISTER_ARTIST_MESSAGE.DISTRICT_IS_REQUIRED
  ),

  ward_code: Yup.number().required(REGISTER_ARTIST_MESSAGE.WARD_IS_REQUIRED),

  street_name: Yup.string()
    .trim()
    .required(REGISTER_ARTIST_MESSAGE.STREET_NAME_IS_REQUIRED)
    .typeError(REGISTER_ARTIST_MESSAGE.STREET_NAME_MUST_BE_STRING),

  portfolio_urls: Yup.array()
    .of(
      Yup.string()
        .required(REGISTER_ARTIST_MESSAGE.PORTFOLIO_URL_IS_REQUIRED)
        .url(REGISTER_ARTIST_MESSAGE.PORTFOLIO_IS_INVALID)
    )
    .min(1, REGISTER_ARTIST_MESSAGE.PORTFOLIO_URL_MUST_BE_AT_LEAST_ONE)
    .max(5, REGISTER_ARTIST_MESSAGE.PORTFOLIO_URL_MUST_BE_AT_MOST_FIVE),

  media_urls: Yup.array()
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
    .min(1, REGISTER_ARTIST_MESSAGE.MEDIA_URL_MUST_BE_AT_LEAST_ONE)
    .max(5, REGISTER_ARTIST_MESSAGE.MEDIA_URL_MUST_BE_AT_MOST_FIVE),
});
