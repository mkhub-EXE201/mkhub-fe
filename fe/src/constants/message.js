export const ADDRESS_MESSAGE = {
  CANNOT_GET_LIST_OF_WARDS: "Lỗi lấy danh sách phường/xã",
  CANNOT_GET_LIST_OF_DISTRICTS: "Lỗi lấy danh sách quận/huyện",
  CANNOT_GET_LIST_OF_PROVINCES: "Lỗi lấy danh sách tỉnh/thành phố",
};
export const REGISTER_ARTIST_MESSAGE = {
  NAME_IS_REQUIRED: "Vui lòng nhập họ tên artist.",
  NAME_IS_INVALID:
    "Tên chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt.",
  NAME_MUST_BE_STRING: "Họ tên artist phải là một chuỗi các kí tự.",
  NAME_MUST_BE_BETWEEN_1_AND_30: "Tên artist phải có độ dài từ 1–30 ký tự.",
  PHONE_NUMBER_IS_REQUIRED: "Vui lòng nhập số điện thoại.",
  PHONE_NUMBER_IS_INVALID: "Số điện thoại không hợp lệ.",
  ADDRESS_TYPE_IS_REQUIRED: "Vui lòng chọn loại địa chỉ.",
  STUDIO_NAME_IS_INVALID:
    "Tên studio chỉ được chứa chữ cái và khoảng trắng, không được chứa số hoặc ký tự đặc biệt.",
  ADDRESS_TYPE_MUST_BE_HOME_OR_STUDIO: "Loại địa chỉ phải là HOME hoặc STUDIO.",
  LOCATION_NAME_IS_REQUIRED: "Vui lòng nhập tên studio.",
  LOCATION_NAME_MUST_BE_BETWEEN_1_AND_30: "Tên studio phải từ 1-30 ký tự.",
  LOCATION_NAME_MUST_BE_STRING: "Tên studio phải là một chuỗi ký tự.",
  PROVINCE_IS_REQUIRED: "Vui lòng chọn Tỉnh/Thành phố.",
  DISTRICT_IS_REQUIRED: "Vui lòng chọn Quận/Huyện.",
  WARD_IS_REQUIRED: "Vui lòng chọn Phường/Xã.",
  STREET_NAME_IS_REQUIRED: "Vui lòng nhập tên đường.",
  STREET_NAME_MUST_BE_STRING: "Tên đường phải là một chuỗi ký tự.",
  PORTFOLIO_URL_IS_REQUIRED:
    "Vui lòng nhập liên kết tới tài khoản khác của bạn.",
  PORTFOLIO_IS_INVALID: "Đường dẫn không hợp lệ.",
  PORTFOLIO_URL_MUST_BE_AT_LEAST_ONE: "Vui lòng nhập ít nhất 1 liên kết.",
  PORTFOLIO_URL_MUST_BE_AT_MOST_FIVE: "Chỉ được nhập tối đa 5 liên kết.",
  PORTFOLIO_URL_HAS_EXISTED:
    "Đường dẫn cho tài khoản này đã tồn tại. Vui lòng nhập cái khác",
  MEDIA_URL_IS_REQUIRED: "Vui lòng tải lên hình ảnh/video của bạn.",
  MEDIA_URL_TYPE_MUST_BE_IMAGE_OR_VIDEO: "Tệp phải là hình ảnh hoặc video",
  MEDIA_URL_MUST_BE_AT_LEAST_ONE: "Vui lòng đăng ít nhất 1 tấm ảnh/video",
  MEDIA_URL_MUST_BE_AT_MOST_FIVE: "Chỉ được đăng tối đa 5 tấm ảnh/video.",
  AVATAR_URL_MUST_BE_IMAGE: "Avatar phải là ảnh.",
  AVATAR_URL_SIZE_MUST_BE_LESS_THAN_2_MB: "Avatar phải nhỏ hơn 2MB.",
  APPLICATION_IS_REQUIRED: "Vui lòng chọn trạng thái xét duyệt.",
  APPLICATION_STATUS_IS_INVALID: "Trạng thái xét duyệt không hợp lệ.",
  REASON_IS_REQUIRED: "Vui lòng nhập lí do từ chối.",
  REASON_MUST_BE_BETWEEN_8_AND_50_CHARACTER:
    "Lý do phải có độ dài từ 8 đến 50 ký tự.",
};
export const ARTIST_SERVICE_MESSAGES = {
  SERVICE_NAME_NOT_EMPTY: "Vui lòng nhập tên cho gói makeup.",
  SERVICE_DESCRIPTION_NOT_EMPTY: "Vui lòng nhập mô tả cho gói makeup.",
  SERVICE_DESCRIPTION_LENGTH_SHOULD_BE_BETWEEN_8_AND_50_CHARACTERS:
    "Mô tả của gói makeup phải có độ dài từ 8-50 ký tự.",
  SERVICE_GROUP_SIZE_NOT_EMPTY: "Vui lòng nhập số lượng người cho gói makeup.",
  SERVICE_GROUP_SIZE_MUST_BE_NUMBER:
    "Số lượng người cho gói makeup phải là số.",
  SERVICE_GROUP_SIZE_IS_INVALID: "Số lượng người phải từ 1 đến 50.",
  SERVICE_MIN_PRICE_NOT_EMPTY: "Vui lòng nhập giá tối thiểu cho gói makeup.",
  SERVICE_MIN_PRICE_MUST_BE_NUMBER: "Giá tối thiểu phải là số.",
  SERVICE_MAX_PRICE_NOT_EMPTY: "Vui lòng nhập giá tối đa cho gói makeup.",
  SERVICE_MAX_PRICE_MUST_BE_NUMBER: "Giá tối đa phải là số.",
  SERVICE_MIN_PRICE_MUST_BE_SMALLER_THAN_MAX_PRICE:
    "Giá tối thiểu phải nhỏ hơn giá tối đa.",
  SERVICE_DURATION_NOT_EMPTY: "Vui lòng nhập thời gian thực hiện gói makeup.",
  SERVICE_DURATION_MUST_BE_NUMBER: "Thời gian thực hiện phải là số.",
  SERVICE_DURATION_IS_INVALID: "Thời gian thực hiện không được nhỏ hơn 0.",
  THUMBNAIL_MUST_BE_IMAGE: "Ảnh bìa cho gói dịch vụ phải là hình ảnh.",
  THUMBNAIL_SIZE_MUST_BE_LESS_THAN_2_MB:
    "Ảnh bìa cho gói dịch vụ phải nhỏ hơn 2MB.",
  SERVICE_IMG_IS_REQUIRED: "Vui lòng tải lên hình ảnh/video của bạn.",
  SERVICE_IMG_TYPE_MUST_BE_IMAGE_OR_VIDEO: "Tệp phải là hình ảnh hoặc video",
  SERVICE_IMG_MUST_BE_AT_LEAST_ONE: "Vui lòng đăng ít nhất 1 tấm ảnh/video",
  SERVICE_IMG_MUST_BE_AT_MOST_FIVE: "Chỉ được đăng tối đa 5 tấm ảnh/video.",
  CATEGORY_ID_NOT_EMPTY: "Vui lòng chọn chủ đề dịch vụ.",
};

export const UPDATE_ARTIST_PROFILE_MESSAGES = {
  EMAIL_IS_INVALID: "Email không hợp lệ.",
};

export const BOOKING_REQUEST_MESSAGES = {
  BOOKING_SCHEDULE_IS_REQUIRED: "Vui lòng chọn lịch hẹn.",
  BOOKING_START_TIME_IS_REQUIRED: "Vui lòng chọn giờ bắt đầu.",
  BOOKING_END_TIME_IS_REQUIRED: "Chưa có giờ kết thúc dự kiến.",
  ADDRESS_TYPE_IS_REQUIRED: "Vui lòng chọn loại địa chỉ đặt hẹn.",
  ADDRESS_TYPE_IS_INVALID: "Loại địa chỉ không hợp lệ.",
  GROUP_SIZE_IS_REQUIRED: "Vui lòng nhập số lượng khách đặt hẹn.",
  GROUP_SIZE_MIN_IS_ONE: "Tối thiểu là 1 khách.",
  PROVINCE_IS_REQUIRED: "Vui lòng chọn Tỉnh/Thành phố.",
  DISTRICT_IS_REQUIRED: "Vui lòng chọn Quận/Huyện.",
  WARD_IS_REQUIRED: "Vui lòng chọn Phường/Xã.",
  STREET_NAME_IS_REQUIRED: "Vui lòng nhập tên đường.",
  STREET_NAME_MUST_BE_STRING: "Tên đường phải là một chuỗi ký tự.",
};
