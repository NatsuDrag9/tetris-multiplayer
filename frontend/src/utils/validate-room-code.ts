function validateRoomCode(
  enteredCode: string,
  originalCode: string
): string | null {
  // Check if the length of entered code is the same as the original code
  if (enteredCode.length !== originalCode.length) {
    return 'Invalid code: length must match';
  }

  // Check if entered code contains at least one uppercase letter
  if (!/[A-Z]/.test(enteredCode)) {
    return 'Invalid code: must contain at least one uppercase letter';
  }

  // Check if entered code contains at least one number
  if (!/\d/.test(enteredCode)) {
    return 'Invalid code: must contain at least one number';
  }

  // Check if entered code matches the original code
  if (enteredCode !== originalCode) {
    return 'Invalid code';
  }

  // If all criteria are met, return null (indicating no error)
  return null;
}

export default validateRoomCode;
