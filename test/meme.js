const Meme = artifacts.require('Meme');
const chai = require('chai');

chai.use(require('chai-as-promised')).should();

contract('Meme', async (accounts) => {
  let meme;

  before(async () => {
    meme = await Meme.deployed();
    console.log('meme address', meme.address);
  });

  describe('contract deployed', async () => {
    it('contract deployed successfully and has a address', async () => {
      const address = await meme.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });
  });

  describe('write hash to contract', async () => {
    let hash;
    before(async () => {
      await meme.writeHash('QmapP2gmhYNMRNDnFbvSe1xLtMmhxWfjRZYdvR388D18u1');
      hash = await meme.readHash();
      console.log(hash);
    });

    it('should have set a has', async () => {
      assert.equal(
        hash,
        'QmapP2gmhYNMRNDnFbvSe1xLtMmhxWfjRZYdvR388D18u1',
        'hash should be properly set'
      );
      // Fail
      await meme.writeHash('abc', { from: accounts[0] }).should.be.rejected;
    });
  });
});
