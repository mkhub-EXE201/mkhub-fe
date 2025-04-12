import * as Yup from "yup";
export const registerSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("Vui lòng nhập họ")
    .min(1, "Họ có độ dài từ 1-50 ký tự")
    .max(50, "Họ có độ dài từ 1-50 ký tự"),
  last_name: Yup.string()
    .required("Vui lòng nhập tên")
    .min(1, "Họ có độ dài từ 1-50 ký tự")
    .max(50, "Họ có độ dài từ 1-50 ký tự"),
  phone_number: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(
      /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ"
    ),
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu có độ dài từ 8-50 ký tự")
    .max(50, "Mật khẩu có độ dài từ 8-50 ký tự"),
  confirm_password: Yup.string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([Yup.ref("password"), null], "Xác nhận mật khẩu không khớp"),
  terms: Yup.boolean()
    .required("Vui lòng đồng ý với điều khoản và chính sách")
    .oneOf([true], "Vui lòng đồng ý với điều khoản và chính sách"),
});
