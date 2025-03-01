import { useMemo } from 'react';

/**
 * Custom hook to format a date range.
 * @param {string} startDate - The start date as an ISO string.
 * @param {string} endDate - The end date as an ISO string.
 * @returns {string} - The formatted date range.
 */
function useFormattedDateRange(startDate, endDate) {
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

    // Return the formatted string
    return `${day}, ${startTime} - ${endTime}`;
  }, [startDate, endDate]);
}

function FormattedDateRangeWrapper({ startDate, endDate, children }) {
    const formattedDateRange = useFormattedDateRange(startDate, endDate);
    return children(formattedDateRange);
}

export default FormattedDateRangeWrapper;
