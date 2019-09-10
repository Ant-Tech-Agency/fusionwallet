import * as ethUtil from 'ethereumjs-util'
import { createCipheriv, createDecipheriv, createHash, pbkdf2Sync } from 'crypto-browserify'
import scryptsy from 'scryptsy'
import { ErrorMsg } from '../constants/error-msg.constant'
import { v4 } from 'uuid'
import { Random } from './random'

export class Wallet {
  _privBuffer
  _pubBuffer
  path
  hwType
  hwTransport

  prefix = '0x'

  constructor(priv, pub, path, hwType, hwTransport) {
    this._privBuffer =
      priv.length === 32 ? priv : new Buffer(priv, 'hex')

    if (pub) {
      this._pubBuffer = new Buffer(pub, 'hex')
    }

    this.path = path
    this.hwType = hwType
    this.hwTransport = hwTransport
  }

  get privBuffer() {
    return this._privBuffer
  }

  get privRaw() {
    if (this.privBuffer) {
      return this.privBuffer.toString('hex')
    }

    return ''
  }

  get privateKey() {
    return this.prefix + this.privRaw
  }

  get pubBuffer() {
    if (!this._pubBuffer) {
      return ethUtil.privateToPublic(this._privBuffer)
    }

    return this._pubBuffer
  }

  get pubRaw() {
    return this.prefix + this.pubBuffer.toString('hex')
  }

  get addressRaw() {
    if (this._privBuffer) {
      return ethUtil.privateToAddress(this._privBuffer)
    }

    if (this._pubBuffer) {
      return ethUtil.publicToAddress(this._pubBuffer, true)
    }

    return ''
  }

  get address() {
    return this.prefix + this.addressRaw.toString('hex')
  }

  get checksumAddress() {
    return ethUtil.toChecksumAddress(this.address)
  }

  static async generate(iCapDirect) {
    if (iCapDirect) {
      while (true) {
        const privKey = await Random.randomBytesAsync(32)
        if (ethUtil.privateToAddress(privKey)[0] === 0) {
          return new Wallet(privKey)
        }
      }
    }

    const privKey = await Random.randomBytesAsync(32)
    return new Wallet(privKey)
  }

  static decipherBuffer(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
  }

  static genSeed(decipher, ciphertext) {
    let seed = Wallet.decipherBuffer(decipher, ciphertext)

    while (seed.length < 32) {
      const nullBuff = new Buffer([0x00])
      seed = Buffer.concat([nullBuff, seed])
    }

    return seed
  }

  static fromEthSale(content, password) {
    const json = content ? JSON.parse(content) : {}
    const encseed = new Buffer(json.encseed, 'hex')
    const bufPwd = new Buffer(password)
    const derivedKey = pbkdf2Sync(bufPwd, bufPwd, 2000, 32, 'sha256').slice(
      0,
      16,
    )
    const decipher = createDecipheriv(
      'aes-128-cbc',
      derivedKey,
      encseed.slice(0, 16),
    )

    const seed = Wallet.decipherBuffer(decipher, encseed.slice(16))
    const wallet = new Wallet(ethUtil.keccak256(seed))

    if (wallet.addressRaw.toString('hex') !== json.ethaddr) {
      throw new Error('Decoded key mismatch - possibly wrong passphrase')
    }

    return wallet
  }

  static getDviKey(
    password,
    data,
  ) {
    if (data) {
      if (data.json) {
        return Wallet.getDviKeyFromKeystore(password, data.json)
      }

      if (data.opts) {
        return Wallet.getDviKeyFromOpts(password, data.opts)
      }
    }

    throw new Error('Missing keystore or kdf params')
  }

  static getDviKeyFromKeystore(password, json) {
    switch (json.crypto.kdf) {
      case 'scrypt': {
        const kdfparams = json.crypto.kdfparams
        return scryptsy(
          new Buffer(password),
          new Buffer(kdfparams.salt, 'hex'),
          kdfparams.n,
          kdfparams.r,
          kdfparams.p,
          kdfparams.dklen,
        )
      }
      case 'pbkdf2': {
        const kdfparams = json.crypto.kdfparams
        if (kdfparams.prf !== 'hmac-sha256') {
          throw new Error('Unsupported parameters to PBKDF2')
        }

        return pbkdf2Sync(
          new Buffer(password),
          new Buffer(kdfparams.salt, 'hex'),
          kdfparams.c,
          kdfparams.dklen,
          'sha256',
        )
      }
      default: {
        throw new Error('Unsupported key derivation scheme')
      }
    }
  }

  static async getDviKeyFromOpts(password, opts) {
    const randomSalt = await Random.randomBytesAsync(32)
    const salt = opts.salt || randomSalt
    const kdf = opts.kdf || 'scrypt'
    const kdfparams = {
      dklen: opts.dklen || 32,
      salt: salt.toString('hex'),
    }

    switch (kdf) {
      case 'pbkdf2': {
        kdfparams.c = opts.c || 262144
        kdfparams.prf = 'hmac-sha256'
        return pbkdf2Sync(
          new Buffer(password),
          salt,
          kdfparams.c,
          kdfparams.dklen,
          'sha256',
        )
      }
      case 'scrypt': {
        kdfparams.n = opts.n || 262144
        kdfparams.r = opts.r || 8
        kdfparams.p = opts.p || 1
        return scryptsy(
          new Buffer(password),
          salt,
          kdfparams.n,
          kdfparams.r,
          kdfparams.p,
          kdfparams.dklen,
        )
      }
      default: {
        throw new Error('Unsupported kdf')
      }
    }
  }

  static decodeCryptojsSalt(content) {
    const ciphertext = new Buffer(content, 'base64')
    if (ciphertext.slice(0, 8).toString() === 'Salted__') {
      return {
        salt: ciphertext.slice(8, 16),
        ciphertext: ciphertext.slice(16),
      }
    } else {
      return {
        ciphertext,
      }
    }
  }

  static evpKdf(data, salt, opts) {
    function iter(block) {
      let hash = createHash(opts.digest || 'md5')
      hash.update(block)
      hash.update(data)
      hash.update(salt)
      block = hash.digest()

      for (let i = 1; i < (opts.count || 1); i++) {
        hash = createHash(opts.digest || 'md5')
        hash.update(block)
        block = hash.digest()
      }

      return block
    }

    let keysize = opts.keysize || 16
    let ivsize = opts.ivsize || 16
    let ret = []
    let i = 0

    while (Buffer.concat(ret).length < keysize + ivsize) {
      ret[i] = iter(i === 0 ? new Buffer(0) : ret[i - 1])
      i++
    }

    let tmp = Buffer.concat(ret)

    return {
      key: tmp.slice(0, keysize),
      iv: tmp.slice(keysize, keysize + ivsize),
    }
  }

  static fromMyEtherWallet(content, password) {
    const json = typeof content === 'object' ? content : JSON.parse(content)
    let privKey

    if (!json.locked) {
      if (json.private.length !== 64) {
        throw new Error('Invalid key length')
      }
      privKey = new Buffer(json.private, 'hex')
    } else {
      if (typeof password !== 'string') {
        throw new Error('Password required')
      }
      if (password.length < 7) {
        throw new Error('Password must be at least 7 characters')
      }

      const cipherData = json.encrypted
        ? json.private.slice(0, 128)
        : json.private
      const cipher = Wallet.decodeCryptojsSalt(cipherData)
      const evp = Wallet.evpKdf(new Buffer(password), cipher.salt, {
        keysize: 32,
        ivsize: 16,
      })

      const decipher = createDecipheriv('aes-256-cbc', evp.key, evp.iv)
      privKey = Wallet.decipherBuffer(decipher, new Buffer(cipher.ciphertext))
      privKey = new Buffer(privKey.toString(), 'hex')
    }

    const wallet = new Wallet(privKey)

    if (wallet.address !== json.address) {
      throw new Error('Invalid key or address')
    }

    return wallet
  }

  static fromMyEtherWalletV2(content) {
    const json = typeof content === 'object' ? content : JSON.parse(content)

    if (json.privKey.length !== 64) {
      throw new Error('Invalid key length')
    }

    const privKey = new Buffer(json.privKey, 'hex')

    return new Wallet(privKey)
  }

  static async fromV3(content, password, nonStrict) {
    const json =
      typeof content === 'object'
        ? content
        : JSON.parse(nonStrict ? content.toLowerCase() : content)

    if (json.version !== 3) {
      throw new Error('Not a V3 wallet')
    }

    const derivedKey = await Wallet.getDviKey(password, { json })

    const ciphertext = new Buffer(json.crypto.ciphertext, 'hex')
    const mac = ethUtil.keccak256(
      Buffer.concat([derivedKey.slice(16, 32), ciphertext]),
    )

    if (mac.toString('hex') !== json.crypto.mac) {
      throw new Error('Key derivation failed - possibly wrong passphrase')
    }

    const decipher = createDecipheriv(
      json.crypto.cipher,
      derivedKey.slice(0, 16),
      new Buffer(json.crypto.cipherparams.iv, 'hex'),
    )
    const seed = Wallet.genSeed(decipher, ciphertext)

    return new Wallet(seed)
  }

  static fromPrivKeyFile(content, password) {
    console.log('test')
    const json = content ? JSON.parse(content) : {}

    if (json.encseed) {
      return Wallet.fromEthSale(content, password)
    }

    if (json.Crypto || json.crypto) {
      return Wallet.fromV3(content, password, true)
    }

    if (json.hash) {
      return Wallet.fromMyEtherWallet(content, password)
    }

    if (json.publisher === 'MyEtherWallet') {
      return Wallet.fromMyEtherWalletV2(content)
    }

    throw ErrorMsg[2]
  }

  async toV3(password, opts) {
    const randomIv = await Random.randomBytesAsync(16)
    const randomSalt = await Random.randomBytesAsync(32)

    const iv = opts.iv || randomIv
    const salt = opts.salt || randomSalt
    const kdf = opts.kdf || 'scrypt'
    const kdfparams = {
      dklen: opts.dklen || 32,
      salt: salt.toString('hex'),
    }

    const derivedKey = await Wallet.getDviKey(password, { opts })
    const cipher = createCipheriv(
      opts.cipher || 'aes-128-ctr',
      derivedKey.slice(0, 16),
      iv,
    )
    if (!cipher) {
      throw new Error('Unsupported cipher')
    }

    const ciphertext = Buffer.concat([cipher.update(this._privBuffer), cipher.final()])
    const mac = ethUtil.keccak(
      Buffer.concat([
        derivedKey.slice(16, 32),
        new Buffer(ciphertext.toString(), 'hex'),
      ]),
    )

    const randomUuid = await Random.randomBytesAsync(16)

    return {
      version: 3,
      id: v4({
        random: opts.uuid || [...randomUuid],
      }),
      address: this.addressRaw.toString('hex'),
      Crypto: {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: {
          iv: iv.toString('hex'),
        },
        cipher: opts.cipher || 'aes-128-ctr',
        kdf,
        kdfparams,
        mac: mac.toString('hex'),
      },
    }
  }

  getV3FileName(timestamp) {
    const ts = timestamp ? new Date(timestamp) : new Date()

    return [
      'UTC--',
      ts.toJSON().replace(/:/g, '-'),
      '--',
      this.addressRaw.toString('hex'),
    ].join('')
  }

  toJSON() {
    return {
      address: this.address,
      checksumAddress: this.checksumAddress,
      privKey: this.privRaw,
      pubKey: this.pubRaw,
      publisher: 'MyEtherWallet',
      encrypted: false,
      version: 2,
    }
  }
}
