export const getSingle = <T>(input: T[] | T | null) => {
  if (input === null) {
    throw new Error('Input is null');
  }

  if (Array.isArray(input)) {
    if (input.length > 0) {
      return input[0];
    } else {
      throw new Error('Array is empty');
    }
  }

  return input;
};

export const getMaybeSingle = <T>(input: T[] | T | null) => {
  if (Array.isArray(input)) {
    if (input.length > 0) {
      return input[0];
    } else {
      return null;
    }
  }

  return input;
};

export const getArray = <T>(input: T[] | T | null) => {
  if (input === null) {
    throw new Error('Input is null');
  }

  if (Array.isArray(input)) {
    return input;
  }

  return [input];
};
