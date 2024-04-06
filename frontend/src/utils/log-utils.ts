/* eslint-disable no-console */
// Disabling this rule only for this file

type LogArgsType = unknown[];

export const logInDev = (...message: LogArgsType): void => {
  if (import.meta.env.VITE_DEV_ENV === 'development') {
    console.log(
      "%c∴ LOGGING IN DEV",
      "font-family: monospace; font-size: 12px; color: green;",
    );
    console.log(...message);
  }
};

export const logErrorInDev = (error: LogArgsType): void => {
  if (import.meta.env.VITE_DEV_ENV === 'development') {
    console.log(
      "%c∴ LOGGING ERROR IN DEV",
      "font-family: monospace; font-size: 12px; color: red;",
    );
    console.error(...error);
  }
};

export const logInTest = (...message: LogArgsType): void => {
  if (import.meta.env.VITE_DEV_ENV === 'testing') {
    console.log('∴ LOGGING IN TEST'); // Removed styling for Node.js
    console.log(...message);
  }
};
