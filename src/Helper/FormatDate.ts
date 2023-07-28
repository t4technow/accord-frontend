export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};


function formatDateInNumeric(dateStr: string): string {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getDayLabel(dateStr: string): string {
  const today = new Date();
  const dateObj = new Date(dateStr);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  if (dateObj.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (dateObj.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const diffInDays = Math.floor((today.getTime() - dateObj.getTime()) / (24 * 60 * 60 * 1000));

    if (diffInDays >= 1 && diffInDays < 7) {
      return daysOfWeek[dateObj.getDay()];
    } else if (diffInDays >= 7) {
      return formatDateInNumeric(dateStr);
    }

    return '';
  }
}