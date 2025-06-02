import * as Yup from "yup";

export const artistAddressSchema = Yup.object().shape({
  bookingSchedule: Yup.object().required("Chưa chọn lịch hẹn."),
  bookingStartTime: Yup.string().required("Chưa chọn giờ bắt đầu."),
  bookingEndTime: Yup.string().required("chưa chọn giờ kết thúc."),
});
export default artistAddressSchema;
