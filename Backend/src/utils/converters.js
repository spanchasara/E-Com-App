export const rupeeFormat = (value) => {
  if (isNaN(value)) {
    return "";
  }

  const formattedValue = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

  return formattedValue.replace(/^(\D+)/, "$1 ").replace(/\.00$/, "") + "/-";
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
};
