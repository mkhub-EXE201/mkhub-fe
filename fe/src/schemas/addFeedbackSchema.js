import * as Yup from "yup";

export const addFeedbackSchema = Yup.object().shape({
  appointment_id: Yup.string().required(),

  content: Yup.string()
    .max(100, "Nội dung bài đánh giá không được vượt quá 100 kí tự.")
    .optional(),

  rating_star: Yup.number()
    .required("Vui lòng chọn số sao đánh giá.")
    .min(1, "Ít nhất hãy để lại 1 sao động viên tụi mình nha🥺")
    .max(5, "Tụi mình chỉ nhận tối đa 5 sao thôi đó😄"),
});
