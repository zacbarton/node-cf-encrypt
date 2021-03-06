/* jshint node: true */
/* jshint bitwise:false */

'use strict';

var uuencode = require('uuencode');

var m_LFSR_A;
var m_LFSR_B;
var m_LFSR_C;

var m_MASK_A = 0x80000062;
var m_MASK_B = 0x40000020;
var m_MASK_C = 0x10000002;
var m_ROT0_A = 0x7fffffff;
var m_ROT0_B = 0x3fffffff;
var m_ROT0_C = 0xfffffff;
var m_ROT1_A = 0x80000000;
var m_ROT1_B = 0xc0000000;
var m_ROT1_C = 0xf0000000;

// public functions

/**
 * Encrypt a value
 *
 * @param {String} string - String to encrypt.
 * @param {String} key - Key or seed used to encrypt the string.
 * @param {String} [encoding=uu] - The binary encoding in which to represent the data as a string. Can be either 'uu', 'hex' or 'base64'.
 * @returns {String} The encrypted value.
 */
function encrypt(inString, key, encoding) {
	if (!encoding) {
		encoding = 'uu';
	}

	var inBytes = new Buffer(inString);
	var outString = transformString(inBytes, key);

	if (encoding === 'base64') {
		outString = outString.toString('base64');
	} else if (encoding === 'hex') {
		outString = outString.toString('hex').toUpperCase();
	} else if (encoding === 'uu') {
		outString = uuencode.encode(outString);
	} else {
		throw new Error('Invalid encoding');
	}

	return outString;
}

/**
 * Decrypt a value
 *
 * @param {String} string - String to decrypt.
 * @param {String} key - The key or seed that was used to encrypt the string.
 * @param {String} [encoding=uu] - The binary encoding in which to represent the data as a string. Must be the same as the algorithm used to encrypt the string.
 * @returns {Buffer} The decrypted value.
 */
function decrypt(inString, key, encoding) {
	if (!encoding) {
		encoding = 'uu';
	}

	var inBytes;
	var outBytes;

	if (encoding === 'base64') {
		inBytes = new Buffer(inString, 'base64');
	} else if (encoding === 'hex') {
		inBytes = new Buffer(inString, 'hex');
	} else if (encoding === 'uu') {
		inBytes = uuencode.decode(inString);
	} else {
		throw new Error('Invalid encoding');
	}

	outBytes = transformString(inBytes, key);

	return outBytes.toString();
}

// private helper functions
function transformString(inBytes, key) {
	m_LFSR_A = 0x13579bdf;
	m_LFSR_B = 0x2468ace0;
	m_LFSR_C = 0xfdb97531;

	setKey(key);

	var length = inBytes.length;
	var outBytes = new Buffer(length);

	for (var i = 0; i < length; ++i) {
		var byte = inBytes.readInt8(i, true);
		outBytes[i] = transformByte(byte);
	}

	return outBytes;
}

function transformByte(target) {
	var crypto = 0;
	var b = m_LFSR_B & 0x1;
	var c = m_LFSR_C & 0x1;

	for (var i = 0; i < 8; ++i) {
		if (0 !== (m_LFSR_A & 0x1)) {
			m_LFSR_A = m_LFSR_A ^ m_MASK_A >>> 1 | m_ROT1_A;

			if (0 !== (m_LFSR_B & 0x1)) {
				m_LFSR_B = m_LFSR_B ^ m_MASK_B >>> 1 | m_ROT1_B;
				b = 1;
			} else {
				m_LFSR_B = m_LFSR_B >>> 1 & m_ROT0_B;
				b = 0;
			}
		} else {
			m_LFSR_A = m_LFSR_A >>> 1 & m_ROT0_A;

			if (0 !== (m_LFSR_C & 0x1)) {
				m_LFSR_C = m_LFSR_C ^ m_MASK_C >>> 1 | m_ROT1_C;
				c = 1;
			} else {
				m_LFSR_C = m_LFSR_C >>> 1 & m_ROT0_C;
				c = 0;
			}
		}

		crypto = crypto << 1 | b ^ c;
	}

	target = target ^ crypto;

	return target;
}

function setKey(key) {
	key = key || 'Default Seed';

	var i;
	var keyLength = key.length;
	var seed = new Array(Math.max(12, keyLength));

	for (i = 0; i < keyLength; i++) {
		seed[i] = key[i].charCodeAt(0);
	}

	for (i = 0; keyLength + i < 12; ++i) {
		seed[keyLength + i] = seed[i];
	}

	for (i = 0; i < 4; i++) {
		m_LFSR_A = (m_LFSR_A << 8) | seed[i + 4];
		m_LFSR_B = (m_LFSR_B << 8) | seed[i + 4];
		m_LFSR_C = (m_LFSR_C << 8) | seed[i + 4];
	}

	if (0 === m_LFSR_A) m_LFSR_A = 0x13579bdf;
	if (0 === m_LFSR_B) m_LFSR_B = 0x2468ace0;
	if (0 === m_LFSR_C) m_LFSR_C = 0xfdb97531;
}

// exports
module.exports = {
	encrypt: encrypt
	, decrypt: decrypt
};
