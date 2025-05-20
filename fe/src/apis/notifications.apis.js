import http from "../utils/http";

export const notificationUrl = "notifications";

const notificationsApis = {
  getAllNotifications: (payload) => {
    console.log(payload);
    const { role, is_read } = payload;
    let query = `?role=${role}`;
    if (is_read !== undefined) {
      query += `&is_read=${is_read}`;
    }
    return http.get(`${notificationUrl}/all${query}`);
  },
};

export default notificationsApis;
