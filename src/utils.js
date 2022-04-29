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
const getDuration = (beginDate, endDate) => dayjs(endDate).diff(beginDate, 'm');

export { getRandomInteger, getHumanizeDay, getHumanizeTime, getMarkupDate, getMarkupTime, getDuration };
