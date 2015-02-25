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

function transformString(key, inBytes) {
	m_LFSR_A = 0x13579bdf;
	m_LFSR_B = 0x2468ace0;
	m_LFSR_C = 0xfdb97531;

	seedFromKey(key);

	var length = inBytes.length;
	var outBytes = new Buffer(length);

	for (var i = 0; i < length; ++i) {
		var byte = inBytes.readInt32LE(i, true); // http://web.cecs.pdx.edu/~harry/compilers/ASCIIChart.pdf
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

function seedFromKey(key) {
	var keyLength = key.length;
	var seed = [keyLength < 12 ? 12 : keyLength];

	for (var i = 0; i < keyLength; i++) {
		seed[i] = key[i].charCodeAt(0);
	}

	for (var i = 0; keyLength + i < 12; ++i) {
		seed[keyLength + i] = seed[i];
	}

	for (var i = 0; i < 4; i++) {
		m_LFSR_A = (m_LFSR_A << 8) | seed[i + 4];
		m_LFSR_B = (m_LFSR_B << 8) | seed[i + 4];
		m_LFSR_C = (m_LFSR_C << 8) | seed[i + 4];
	}

	if (0 === m_LFSR_A) m_LFSR_A = 0x13579bdf;
	if (0 === m_LFSR_B) m_LFSR_B = 0x2468ace0;
	if (0 === m_LFSR_C) m_LFSR_C = 0xfdb97531;
}

function encrypt(key, text, encoding) {
	if (!encoding) encoding = 'uu';

	var outString;
	var outBytes = transformString(key, new Buffer(text));

	if (encoding === 'base64') {
		outString = outBytes.toString('base64');
	} else if (encoding === 'hex') {
		outString = outBytes.toString('hex').toUpperCase();
	} else if (encoding === 'uu') {
		outString = uuencode.encode(outBytes);
	}

	return outString;
}

function decrypt(key, text, encoding) {
	if (!encoding) encoding = 'uu';

	if (encoding === 'base64') {
		text = new Buffer(text, 'base64');
	} else if (encoding === 'hex') {
		text = new Buffer(text, 'hex');
	} else if (encoding === 'uu') {
		text = uuencode.decode(text);
	}

	var outBytes = transformString(key, new Buffer(text));
	var outString = outBytes.toString();

	return outString;
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;