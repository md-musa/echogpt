import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 32 || Buffer.byteLength(key, 'utf8') !== 32) {
        throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
    }
    return Buffer.from(key, 'utf8');
}

export function encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return Buffer.concat([iv, encrypted]).toString('base64');
}

export function decrypt(payload: string): string {
    const data = Buffer.from(payload, 'base64');
    if (data.length <= IV_LENGTH) throw new Error('Invalid encrypted payload');
    const iv = data.subarray(0, IV_LENGTH);
    const encrypted = data.subarray(IV_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

export function maskApiKey(key: string): string {
    if (key.length <= 8) return '****';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
}