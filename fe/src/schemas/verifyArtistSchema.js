import * as Yup from "yup";
import { ARTIST_APPLICATION_STATUS } from "../constants/enum";
import { REGISTER_ARTIST_MESSAGE } from "../constants/message";

export const verifyArtistSchema = Yup.object().shape({
  verify_status: Yup.string()
    .required(REGISTER_ARTIST_MESSAGE.APPLICATION_IS_REQUIRED)
    .oneOf(
      [ARTIST_APPLICATION_STATUS.APPROVED, ARTIST_APPLICATION_STATUS.REJECTED],
      REGISTER_ARTIST_MESSAGE.APPLICATION_STATUS_IS_INVALID
    ),

  reason: Yup.string().when("verify_status", {
    is: ARTIST_APPLICATION_STATUS.REJECTED,
    then: (schema) =>
      schema
        .required(REGISTER_ARTIST_MESSAGE.REASON_IS_REQUIRED)
        .min(
          8,
          REGISTER_ARTIST_MESSAGE.REASON_MUST_BE_BETWEEN_8_AND_50_CHARACTER
        )
        .max(
          50,
          REGISTER_ARTIST_MESSAGE.REASON_MUST_BE_BETWEEN_8_AND_50_CHARACTER
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
