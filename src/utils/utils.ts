export const handleFormatDate = (dateObj: Date) => {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

export const handleSetContentStatus = (value: number) => {
  switch (value) {
    case 0:
      return "New";
    case 1:
      return "In Progress";
    case 2:
      return "Completed";
    default:
      "";
      break;
  }
};