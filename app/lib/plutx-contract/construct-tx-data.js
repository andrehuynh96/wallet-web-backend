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
  userAddAddress: async (_domain, _subDomain, _crypto, _address) => {
    try {
      let paramTypeList = ["string", "string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        _address,
        await _getSig(_subDomain, _crypto)
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
  userEditAddress: async (_domain, _subDomain, _crypto, _newAddress) => {
    try {
      let paramTypeList = ["string", "string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        _newAddress,
        await _getSig(_subDomain, _crypto)
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
  userRemoveAddress: async (_domain, _subDomain, _crypto) => {
    try {
      let paramTypeList = ["string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        await _getSig(_subDomain, _crypto)
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
  createSubdomain: async (_domain, _subDomain) => {
    try {
      return true;
      let paramTypeList = ["string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        await _getSig(_subDomain, _crypto)
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
      console.log('construct createSubdomain tx error:', e);
      return null;
    }
  },
}

async function _constructAndSignTx(data, value = '0x0') {
  return new Promise(async (resolve, reject) => {
    let from = await txCreator.getAddress();
    console.log('from address:', from);
    let nonce = await coinAPI.getNonce(from);
    console.log('nonce:', nonce.data.nonce);
    const txParams = {
      nonce: nonce.data.nonce + 3,
      gasPrice: config.txCreator.ETH.fee,
      gasLimit: config.txCreator.ETH.gasLimit,
      // from: from,
      to: config.plutx.dnsContract.address,
      value,
      data
    };
    let tx = new Transaction(txParams, { chain: config.txCreator.ETH.testNet === 1 ? 'ropsten' : 'mainnet' });
    console.log('unsigned tx_raw:', tx.serialize().toString('hex'));
    let { tx_raw, tx_id } = await txCreator.sign({ raw: tx.serialize().toString('hex') });
    let ret = await coinAPI.sendTransaction({ rawtx: '0x' + tx_raw });
    console.log('signed tx_raw:', tx_raw);
    console.log('ret:', ret);
    if (ret.msg) reject('Broadcast tx failed: ' + ret.msg);
    if (tx_raw) resolve({ tx_raw, tx_id: ret.data.tx_id.replace('0x', '') });
    else reject('Sign and send transaction failed');
  })
}

async function _sign(unsignedSig) {
  return new Promise(async (resolve, reject) => {
    // resolve('6d0f299022f7616ac8a78d4b04ca8078afe822b38d56303d66003e171ef6424a')
    let sig = await txCreator.sign({ raw: unsignedSig });
    console.log('sig:', sig);
    if (sig) resolve(sig.tx_raw);
    else reject('Sign domain admin signature failed');
  })
}

async function _getSig (subdomain, crypto) {
  try {
    const unsignedSig = utils.soliditySha3(config.plutx.domain, subdomain, crypto.toLowerCase());
    console.log('unsigned sig:', unsignedSig);
    return await _sign(unsignedSig);
  }
  catch (e) {
    console.log('get domain admin signature error:', e);
    return null;
  }
}