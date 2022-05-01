import dayjs from 'dayjs';

const getRandomInteger = (begin = 0, end = 1) => {
  const lower = Math.ceil(Math.min(begin, end));
  const upper = Math.floor(Math.max(begin, end));

  return Math.floor(lower + Math.random() * (upper + 1 - lower));
};

const getHumanizeDay = (date) => dayjs(date).format('MMM D');
const getHumanizeTime = (date) => dayjs(date).format('HH:mm');
const getMarkupDate = (date) => dayjs(date).format('YYYY-MM-DD');
const getMarkupTime = (date) => dayjs(date).format('YYYY-MM-DDTHH:mm');
const getDuration = (beginDate, endDate) => {
  const duration = dayjs(endDate).diff(beginDate, 'm');
  if (duration > (24 * 60)) {
    return `${ (duration / (24 * 60)).toFixed() }D ${ (duration / 60).toFixed() }H ${ duration % 60 }M`;
  }
  if (duration > 60) {
    return `${ (duration / 60).toFixed() }H ${ duration % 60 }M`;
  }
  return `${ duration }M`;
};
const getEditTime = (date) => dayjs(date).format('DD/MM/YY HH:mm')

export { getRandomInteger, getHumanizeDay, getHumanizeTime, getMarkupDate, getMarkupTime, getDuration, getEditTime };
