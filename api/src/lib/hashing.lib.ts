import bcrypt from 'bcryptjs'

export function hash(value: string): Promise<string> {
  return bcrypt.hash(value, 12)
}

export function compare(value: string, hash: string): Promise<boolean> {
  return bcrypt.compare(value, hash)
}
