export const formatDate = (date, locale = 'en-us', format = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!date) {
    return '';
  }
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat(locale, format).format(date);
};
