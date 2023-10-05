/**
 * Converts a date string to a formatted date string
 * @param {string} date - The date string to convert.
 * @returns the formatted date string.
 */
function convertDate(date) {
  // Create a Date object from the input string
  const datetime = new Date(date);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the components (hour, minute, day, month, year) from the Date object
  const hour = datetime.getHours();
  const minute = datetime.getMinutes().toString().padStart(2, "0");
  const day = datetime.getDate().toString();
  const month = monthNames[datetime.getMonth()];
  const year = datetime.getFullYear().toString();

  // Determine whether it's AM or PM
  const ampm = hour >= 12 ? "PM" : "AM";

  // Convert the hour to 12-hour format
  const formattedHour = hour % 12 || 12;

  // Create the formatted string
  const formattedDatetime = `${formattedHour}:${minute} ${ampm} on ${day} ${month} ${year}`;

  return formattedDatetime;
}

export default convertDate;
