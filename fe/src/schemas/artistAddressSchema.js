import * as Yup from "yup";
import { ARTIST_WORKING_LOCATION_TYPE } from "../constants/enum";
import { REGISTER_ARTIST_MESSAGE } from "../constants/message";

export const artistAddressSchema = Yup.object().shape({
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
  is_default: Yup.boolean(),
});
