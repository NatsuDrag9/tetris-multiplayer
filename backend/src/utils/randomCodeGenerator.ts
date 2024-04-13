// Function to shuffle a string randomly
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

function generateCode(length: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let code = '';

  // Generate initial code without uppercase letters and digits
  for (let i = 0; i < length - 2; i += 1) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    code += alphabet[randomIndex];
  }

  // Append one uppercase letter randomly
  const uppercaseIndex = Math.floor(Math.random() * alphabet.length);
  code += alphabet[uppercaseIndex].toUpperCase();

  // Append one digit randomly
  const digitIndex = Math.floor(Math.random() * numbers.length);
  code += numbers[digitIndex];

  // Shuffle the code to ensure randomness
  code = shuffleString(code);

  return code;
}

export default generateCode;
