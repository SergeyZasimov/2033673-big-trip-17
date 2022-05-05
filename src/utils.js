import dayjs from 'dayjs';

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const getRandomInteger = (begin = 0, end = 1) => {
  const lower = Math.ceil(Math.min(begin, end));
  const upper = Math.floor(Math.max(begin, end));

  return Math.floor(lower + Math.random() * (upper + 1 - lower));
};

const getRandomUniqList = (length) => {
  const resultList = [];
  return () => {
    for (let i = 0; i < getRandomInteger(0, length); i++) {
      let number;
      do {
        number = getRandomInteger(1, length + 1);
      } while (resultList.includes(number));
      resultList.push(number);
    }
    return resultList;
  };
};

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
  getRandomInteger,
  getHumanizeDay,
  getHumanizeTime,
  getMarkupDate,
  getMarkupTime,
  getDuration,
  getEditTime,
  getRandomUniqList
};
