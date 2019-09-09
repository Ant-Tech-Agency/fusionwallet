import { getRandomBytesAsync } from 'expo-random'

export class Random {
  static toBuffer(ab) {
    const buf = Buffer.alloc(ab.byteLength)
    const view = new Uint8Array(ab)
    for (let i = 0; i < buf.length; ++i) {
      buf[i] = view[i]
    }

    return buf
  }

  static async randomBytesAsync(byteCount) {
    const uint8Array = await getRandomBytesAsync(byteCount)
    return Random.toBuffer(uint8Array)
  }
}
