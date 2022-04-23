const Meme = artifacts.require('Meme');

module.exports = (deployer) => {
  deployer.deploy(Meme);
};
