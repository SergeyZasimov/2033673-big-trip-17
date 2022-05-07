import dayjs from 'dayjs';

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const getHumanizeDay = (date) => dayjs(date).format('MMM D');
const getHumanizeTime = (date) => dayjs(date).format('HH:mm');
const getMarkupDate = (date) => dayjs(date).format('YYYY-MM-DD');
const getMarkupTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const getDuration = (beginDate, endDate) => {
  const duration = dayjs(endDate).diff(beginDate, 'm');
  if (duration > (HOURS_PER_DAY * MINUTES_PER_HOUR)) {
    return `${ (duration / (HOURS_PER_DAY * MINUTES_PER_HOUR)).toFixed() }D ${ (duration / MINUTES_PER_HOUR).toFixed() }H ${ duration % MINUTES_PER_HOUR }M`;
  }
  if (duration > MINUTES_PER_HOUR) {
    return `${ (duration / MINUTES_PER_HOUR).toFixed() }H ${ duration % MINUTES_PER_HOUR }M`;
  }
  return `${ duration }M`;
};
const getEditTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

export {
  getEditTime,
  getMarkupDate,
  getMarkupTime,
  getHumanizeTime,
  getHumanizeDay,
  getDuration
};
