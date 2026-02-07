export const randomNumberCode = (codeLength = 6) => {
  let result = '';

  for (let i = 0; i < codeLength; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
};
