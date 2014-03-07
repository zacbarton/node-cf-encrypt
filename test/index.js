var encrypt = require('../');

describe('CF_COMPAT', function() {
	
	// encrypt
	it('should match coldfusion encrypt(hex)', function(done) {
		var node = encrypt.encrypt('key', 'text', 'hex');
		var cf = '4D8E6307';
		
		node.should.equal(cf);
		done();
	});
	
	it('should match coldfusion encrypt(base64)', function(done) {
		var node = encrypt.encrypt('secretkey', 'hello cf', 'base64');
		var cf = 'UY538RLNWKo=';
		
		node.should.equal(cf);
		done();
	});
	
	it('shouldnt error when encrypting without the 3rd argument', function(done) {
		var node = encrypt.encrypt('key', 'text');
		
		node.should.not.be.a.Error;
		done();
	});
	
	
	// decrypt
	it('should decrypt a coldfusion encrypt(hex)', function(done) {
		var cf = '7BDA57B71C1CA2F05299';
		var node = encrypt.decrypt(');8HO=]K?HE*', cf, 'hex');
		
		node.should.equal('hello node');
		done();
	});
	
	it('should decrypt a coldfusion encrypt(base64)', function(done) {
		var cf = 'RYKhg7Y3Upgu/g==';
		var node = encrypt.decrypt('!@#$%^&*()_+', cf, 'base64');
		
		node.should.equal('hello node');
		done();
	});
	
	it('shouldnt error when decrypting without the 3rd argument', function(done) {
		var node = encrypt.decrypt('key', 'text');
		
		node.should.not.be.a.Error;
		done();
	});
	
});