/**
 * Cryptographically secure random password generator
 */
export function generateSecurePassword(length = 16): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowercase = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*()_+~=";
  const allChars = uppercase + lowercase + numbers + symbols;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  // Guarantee at least one of each category
  const passwordChars = [
    uppercase[array[0]! % uppercase.length],
    lowercase[array[1]! % lowercase.length],
    numbers[array[2]! % numbers.length],
    symbols[array[3]! % symbols.length],
  ];

  for (let i = 4; i < length; i++) {
    passwordChars.push(allChars[array[i]! % allChars.length]);
  }

  // Shuffle array using Fisher-Yates
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = array[i]! % (i + 1);
    const temp = passwordChars[i]!;
    passwordChars[i] = passwordChars[j]!;
    passwordChars[j] = temp;
  }

  return passwordChars.join("");
}
