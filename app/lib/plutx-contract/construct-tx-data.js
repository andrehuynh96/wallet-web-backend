const abi = require('ethereumjs-abi');
const config = require('app/config');
const txCreator = require('app/lib/tx-creator');
const BN = require('bn.js');
const Transaction = require('ethereumjs-tx').Transaction;
const InfinitoApi = require('node-infinito-api');
const utils = require('web3-utils');

const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secretKey,
  baseUrl: config.sdk.baseUrl
};
const api = new InfinitoApi(opts);
let coinAPI = api.ETH;

module.exports = {
  userAddAddress: async (_domain, _subDomain, _crypto, _address, sig) => {
    try {
      let paramTypeList = ["string", "string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        _address,
        sig
      ];
      let sig = abi.methodID(
        config.plutx.dnsContract.userAddAddress,
        paramTypeList
      );
      let encodedParams = abi.rawEncode(paramTypeList, paramList);
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data);
      return ret;
    }
    catch (e) {
      console.log('construct userAddAddress tx error:', e);
      return null;
    }
  },
  userEditAddress: async (_domain, _subDomain, _crypto, _newAddress, sig) => {
    try {
      let paramTypeList = ["string", "string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        _newAddress,
        sig
      ];
      let sig = abi.methodID(
        config.plutx.dnsContract.userEditAddress,
        paramTypeList
      );
      let encodedParams = abi.rawEncode(paramTypeList, paramList);
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data);
      return ret;
    }
    catch (e) {
      console.log('construct userEditAddress tx error:', e);
      return null;
    }
  },
  userRemoveAddress: async (_domain, _subDomain, _crypto, sig) => {
    try {
      let paramTypeList = ["string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        sig
      ];
      let sig = abi.methodID(
        config.plutx.dnsContract.userRemoveAddress,
        paramTypeList
      );
      let encodedParams = abi.rawEncode(paramTypeList, paramList);
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data);
      return ret;
    }
    catch (e) {
      console.log('construct userRemoveAddress tx error:', e);
      return null;
    }
  },
  getSig: async (subdomain, crypto) => {
    try {
      const unsignedSig = utils.soliditySha3(config.plutx.domain, subdomain, crypto);
      console.log(unsignedSig);
      await _sign(unsignedSig);
    }
    catch (e) {
      console.log('get domain admin signature error:', e);
      return null;
    }
  }
}

async function _constructAndSignTx(data, value = '0x0') {
  return new Promise(async (resolve, reject) => {
    let from = await txCreator.getAddress();
    let nonce = await coinAPI.getNonce(from);
    const txParams = {
      nonce: nonce.data.nonce,
      gasPrice: config.txCreator.ETH.fee,
      gasLimit: config.txCreator.ETH.gasLimit,
      from,
      to: config.lockingContract.address,
      value,
      data
    };
    let tx = new Transaction(txParams, { chain: config.txCreator.ETH.testNet === 1 ? 'ropsten' : 'mainnet' });
    let { tx_raw, tx_id } = await txCreator.sign({ raw: tx.serialize().toString('hex') });
    console.log(tx_raw);
    if (tx_raw) resolve({ tx_raw, tx_id: ret.data.tx_id});
    else reject('Sign transaction failed');
  })
}

async function _sign(unsignedSig) {
  return new Promise(async (resolve, reject) => {
    let sig = await txCreator.sign({ raw: unsignedSig });
    if (sig) resolve(sig);
    else reject('Sign domain admin signature failed');
  })
}
