import dayjs from 'dayjs';

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const getHumanizeDay = (date) => dayjs(date).format('MMM D');
const getHumanizeTime = (date) => dayjs(date).format('HH:mm');
const getMarkupDate = (date) => dayjs(date).format('YYYY-MM-DD');
const getMarkupTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const getEditTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const durationFormat = (number) => number < 10 ? `0${ number }` : number;

const getDuration = (beginDate, endDate) => {
  const days = dayjs(endDate).diff(beginDate, 'd');
  const hours = dayjs(endDate).diff(beginDate, 'h') - (days * HOURS_PER_DAY);
  const minutes = dayjs(endDate).diff(beginDate, 'm') % MINUTES_PER_HOUR;
  if (days) {
    return `${ durationFormat(days) }D  ${ durationFormat(hours) }H ${ durationFormat(minutes) }M`;
  }
  if (hours) {
    return `${ durationFormat(hours) }H ${ durationFormat(minutes) }M`;
  }
  return `${ durationFormat(minutes) }M`;

};


export {
  getEditTime,
  getMarkupDate,
  getMarkupTime,
  getHumanizeTime,
  getHumanizeDay,
  getDuration
};
