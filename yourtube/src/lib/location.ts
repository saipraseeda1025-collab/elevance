export const southIndianStates = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
];

export const getCurrentISTHour = () => {
  const now = new Date();

  const hour = Number(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hour12: false,
    })
  );

  return hour;
};

export const shouldUseLightTheme = (state: string) => {
  const hour = getCurrentISTHour();

  return southIndianStates.includes(state);
};