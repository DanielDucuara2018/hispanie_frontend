import { useMemo } from 'react';

/**
 * Custom hook to format a date range.
 * @param {string} startDate - The start date as an ISO string.
 * @param {string} endDate - The end date as an ISO string.
 * @param {boolean} [showDay=true] - Flag to determine if the day should be displayed.
 * @returns {string} - The formatted date range.
 */
function useFormattedDateRange(startDate, endDate, showDay = true) {
  return useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Formatter for the day of the week
    const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
    // Formatter for the time
    const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });

    // Extract the day and times
    const day = dayFormatter.format(start);
    const startTime = timeFormatter.format(start);
    const endTime = timeFormatter.format(end);

    // Return the formatted string based on showDay flag
    if (showDay) {
      return `${day}, ${startTime} - ${endTime}`;
    } else {
      return `${startTime} - ${endTime}`;
    }
  }, [startDate, endDate, showDay]);
}

function FormattedDateRangeWrapper({ startDate, endDate, showDay = true, children }) {
  const formattedDateRange = useFormattedDateRange(startDate, endDate, showDay);
  return children(formattedDateRange);
}

export default FormattedDateRangeWrapper;
