// import { logInDev } from "./log-utils";

function getNumberAfterColon(str: string): number | null {
  const index = str.indexOf(':');
  if (index !== -1) {
    const numberStr = str.substring(index + 1).trim(); // Trim any leading or trailing whitespace
    const number = Number(numberStr);
    if (!Number.isNaN(number)) {
      return number;
    }
  }
  return null;
}

// Example usage:
// const str = 'key: 123';
// const numberAfterColon = getNumberAfterColon(str);
// logInDev(numberAfterColon); // Output: 123

export default getNumberAfterColon;
