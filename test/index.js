var encrypt = require('../');

describe('cf-encrypt', function() {

	// encrypt
	it('should match coldfusion encrypt(uu)', function(done) {
		var node = encrypt.encrypt('text', 'key', 'uu');
		var cf = '$38YC!P  \n';

		node.should.equal(cf);
		done();
	});

	it('should match coldfusion encrypt(hex)', function(done) {
		var node = encrypt.encrypt('text', 'key', 'hex');
		var cf = '4D8E6307';

		node.should.equal(cf);
		done();
	});

	it('should match coldfusion encrypt(base64)', function(done) {
		var node = encrypt.encrypt('text', 'key', 'base64');
		var cf = 'TY5jBw==';

		node.should.equal(cf);
		done();
	});

	it('shouldnt error when encrypting without the 3rd argument', function(done) {
		var node = encrypt.encrypt('text', 'key');

		node.should.not.be.a.Error;
		done();
	});


	// decrypt
	it('should decrypt a coldfusion encrypt(uu)', function(done) {
		var cf = '$38YC!P  \n';
		var node = encrypt.decrypt(cf, 'key', 'uu');

		node.should.equal('text');
		done();
	});

	it('should decrypt a coldfusion encrypt(hex)', function(done) {
		var cf = '4D8E6307';
		var node = encrypt.decrypt(cf, 'key', 'hex');

		node.should.equal('text');
		done();
	});

	it('should decrypt a coldfusion encrypt(base64)', function(done) {
		var cf = 'TY5jBw==';
		var node = encrypt.decrypt(cf, 'key', 'base64');

		node.should.equal('text');
		done();
	});

	it('shouldnt error when decrypting without the 3rd argument', function(done) {
		var node = encrypt.decrypt('text', 'key');

		node.should.not.be.a.Error;
		done();
	});

});
