export function convertTimestampToTimeFormat(timestamp: string): string {
  const dateObject = new Date(timestamp);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  return formattedTime;
}

// export function convertTimestampToTimeFormat(timestamp: string): string {
//   const dateObject = new Date(timestamp);
//   const hours = dateObject.getHours();
//   const minutes = dateObject.getMinutes();
//   const amPm = hours >= 12 ? 'pm' : 'am';
//   const formattedHours = hours % 12 || 12; // Convert to 12-hour format
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//   const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;
//   return formattedTime;
// }
