import * as bcrypt from 'bcrypt';


export async function hashData(password: string, saltRounds: number = 10) {
  return bcrypt.hash(password, saltRounds);
}

export async function compareHashedData(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
