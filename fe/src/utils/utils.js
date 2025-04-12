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
