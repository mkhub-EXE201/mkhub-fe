import dayjs from "dayjs";

export function formatCurrency(value) {
  return new Intl.NumberFormat("de-DE").format(value);
}

export function formatNumberToSocialStyle(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .replace(".", ",")
    .toLowerCase();
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en")
    .format(value)
    .replace(".", ",")
    .toLowerCase();
}

export function formatDateTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const formatTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};
export const getStatusColor = (status) => {
  switch (status) {
    case "PENDING":
      return "#facc15";
    case "APPROVED":
      return "#4ade80";
    case "REJECTED":
      return "#f87171";
    default:
      return "#d1d5db";
  }
};

export const generateTimeSlots = (interval = 30) => {
  const slots = [];
  let time = dayjs().startOf("day");
  const end = dayjs().endOf("day");

  while (time.isBefore(end)) {
    slots.push(time.format("HH:mm"));
    time = time.add(interval, "minute");
  }
  return slots;
};

export const getValidEndTimeSlots = (startTime, interval = 30) => {
  const allSlots = generateTimeSlots(interval);
  const today = dayjs().format("YYYY-MM-DD");
  const start = dayjs(`${today} ${startTime}`, "YYYY-MM-DD HH:mm");

  return allSlots.filter((slot) => {
    const slotTime = dayjs(`${today} ${slot}`, "YYYY-MM-DD HH:mm");
    return slotTime.isAfter(start);
  });
};
