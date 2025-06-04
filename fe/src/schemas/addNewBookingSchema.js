import * as Yup from "yup";
import { BOOKING_REQUEST_MESSAGES } from "../constants/message";
import { BOOKING_ADDRESS_TYPE } from "../constants/enum";

export const artistAddressSchema = Yup.object().shape({
  bookingSchedule: Yup.object().required(
    BOOKING_REQUEST_MESSAGES.BOOKING_SCHEDULE_IS_REQUIRED
  ),
  bookingStartTime: Yup.string().required(
    BOOKING_REQUEST_MESSAGES.BOOKING_START_TIME_IS_REQUIRED
  ),
  bookingEndTime: Yup.string().required(
    BOOKING_REQUEST_MESSAGES.BOOKING_END_TIME_IS_REQUIRED
  ),
  service_id: Yup.string().required(),
  client_id: Yup.string(),
  client_phone: Yup.string(),
  artist_id: Yup.string(),
  artist_phone: Yup.string(),
  address_type: Yup.string()
    .required(BOOKING_REQUEST_MESSAGES.ADDRESS_TYPE_IS_REQUIRED)
    .oneOf(
      [
        BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS,
        BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS,
      ],
      BOOKING_REQUEST_MESSAGES.ADDRESS_TYPE_IS_INVALID
    ),
  address_id: Yup.string().when("address_type", {
    is: BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS,
    then: (schema) =>
      schema.required(BOOKING_REQUEST_MESSAGES.ADDRESS_ID_IS_REQUIRED),
    otherwise: (schema) => schema.optional(),
  }),
  province_id: Yup.number().required(
    BOOKING_REQUEST_MESSAGES.PROVINCE_IS_REQUIRED
  ),
  district_id: Yup.number().required(
    BOOKING_REQUEST_MESSAGES.DISTRICT_IS_REQUIRED
  ),
  ward_code: Yup.number().required(BOOKING_REQUEST_MESSAGES.WARD_IS_REQUIRED),
  street_name: Yup.string().required(
    BOOKING_REQUEST_MESSAGES.STREET_NAME_IS_REQUIRED
  ),
  group_size: Yup.number()
    .required(BOOKING_REQUEST_MESSAGES.GROUP_SIZE_IS_REQUIRED)
    .min(1, BOOKING_REQUEST_MESSAGES.GROUP_SIZE_MIN_IS_ONE),
  client_note: Yup.string().optional(),
  total_price: Yup.number().required(),
});
export default artistAddressSchema;
