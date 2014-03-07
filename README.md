cf-encrypt
========

Node.js implementation of the ColdFusion `encrypt()` and `decrypt()` functions. This will allow you to encrypt and decrypt strings using the CFMX_COMPAT algorithm.

The ColdFusion `encrypt()` and `decrypt()` functions also encode the result after encryption and automatically decode before decryption. This module applies the same encoding and decoding behaviours as ColdFusion.

- Base64: the Base64 algorithm, as specified by IETF RFC 2045.
- Hex: the characters A-F0-9 represent the hexadecimal byte values.
- UU: the UUEncode algorithm (DEFAULT).

Translated from [here](https://github.com/globaldev/cfmx_compat).

Installation
--------

    $ npm install -g cf-encrypt

Examples
--------

The following examples show you how to use cf-encrypt.

```javascript
var encrypt = require('cf-encrypt');

// encrypt something
var encrypted = encrypt.encrypt('secretkey', 'hello cf', 'uu');
// '(48YW\1+-6*H \n'

// decrypt something
var decrypted = encrypt.decrypt('secretkey', '518E77F112CD55A3FD5C', 'hex');
// 'hello node'

var decrypted = encrypt.decrypt('9)qkg4[0yK*wC58D46:!rYc=h>9<)Q', 'de2j+4tUt4KYV1pTBY+5x6K0X1YTzoOMdxSMmbXP', 'base64');
// something a bit more realistic
```

Running tests
----

    $ npm test
