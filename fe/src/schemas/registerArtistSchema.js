import * as Yup from "yup";

export const registerArtistSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Vui lòng nhập họ tên artist.")
    .typeError("Họ tên artist phải là một chuỗi.")
    .min(1, "Tên artist phải có độ dài từ 1–30 ký tự.")
    .max(30, "Tên artist phải có độ dài từ 1–30 ký tự."),

  phone_number: Yup.string()
    .trim()
    .required("Vui lòng nhập số điện thoại.")
    .typeError("Số điện thoại không hợp lệ.")
    .matches(/^(?:84|0)(3|5|7|8|9)\d{8}$/, "Số điện thoại không hợp lệ."),

  address_type: Yup.string()
    .required("Loại địa chỉ không được để trống.")
    .oneOf(["HOME", "STUDIO"], "Loại địa chỉ phải là HOME hoặc STUDIO."),

  location_name: Yup.string()
    .when("address_type", {
      is: "STUDIO",
      then: (schema) =>
        schema
          .required("Vui lòng nhập tên studio.")
          .min(1, "Tên studio phải từ 1 đến 30 ký tự.")
          .max(30, "Tên studio phải từ 1 đến 30 ký tự."),
      otherwise: (schema) => schema.optional(),
    })
    .typeError("Tên studio phải là một chuỗi ký tự."),

  province_id: Yup.number().required("Vui lòng chọn Tỉnh/Thành phố."),

  district_id: Yup.number().required("Vui lòng chọn Quận/Huyện."),

  ward_code: Yup.number().required("Vui lòng chọn Phường/Xã."),

  street_name: Yup.string()
    .trim()
    .required("Vui lòng nhập tên đường.")
    .typeError("Họ tên artist phải là một chuỗi kỹ tự."),

  portfolio_urls: Yup.array()
    .of(
      Yup.string()
        .required("Vui lòng nhập liên kết tới tài khoản khác của bạn.")
        .url("URL không hợp lệ")
    )
    .min(1, "Phải có ít nhất 1 liên kết"),
});
