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

export {
  getRandomInteger,
  getRandomUniqList
};
