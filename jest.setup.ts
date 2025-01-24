import '@testing-library/jest-dom';

beforeEach(() => {
  jest.clearAllMocks();
});

jest.setTimeout(10000);

console.error = jest.fn();
