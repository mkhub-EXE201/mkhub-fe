import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),

  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu có độ dài từ 8-50 ký tự")
    .max(50, "Mật khẩu có độ dài từ 8-50 ký tự"),
});
