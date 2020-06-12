const abi = require('ethereumjs-abi');
const config = require('app/config');
const txCreator = require('app/lib/tx-creator');
const BN = require('bn.js');
const Transaction = require('ethereumjs-tx').Transaction;
const InfinitoApi = require('node-infinito-api');
const utils = require('web3-utils');
const Web3Eth = require('web3-eth');
const eth = new Web3Eth();

const opts = {
  apiKey: config.sdk.apiKey,
  secret: config.sdk.secretKey,
  baseUrl: config.sdk.baseUrl
};
const api = new InfinitoApi(opts);
let coinAPI = api.ETH;

module.exports = {
  userAddAddress: async (_domain, _subDomain, _crypto, _address, signAddress) => {
    try {
      let paramTypeList = ["string", "string", "string", "string", "bytes"];
      let paramList = [
        _domain,
        _subDomain,
        _crypto,
        _address,
        await _getSig(_subDomain, _crypto)
      ];
      // console.log(paramList)
      let sig = abi.methodID(
        config.plutx.dnsContract.userAddAddress,
        paramTypeList
      );
      let encodedParams = eth.abi.encodeParameters(paramTypeList, paramList);
      encodedParams = encodedParams.replace('0x', '');
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data, signAddress);
      return ret;
    }
    catch (e) {
      console.log('construct userAddAddress tx error:', e);
      return null;
    }
  },
  userEditAddress: async (_domain, _subDomain, _crypto, _newAddress, signAddress) => {
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
      let encodedParams = eth.abi.encodeParameters(paramTypeList, paramList);
      encodedParams = encodedParams.replace('0x', '');
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data, signAddress);
      return ret;
    }
    catch (e) {
      console.log('construct userEditAddress tx error:', e);
      return null;
    }
  },
  userRemoveAddress: async (_domain, _subDomain, _crypto, signAddress) => {
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
      let encodedParams = eth.abi.encodeParameters(paramTypeList, paramList);
      encodedParams = encodedParams.replace('0x', '');
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data, signAddress);
      return ret;
    }
    catch (e) {
      console.log('construct userRemoveAddress tx error:', e);
      return null;
    }
  },
  createSubdomain: async (_domain, _subDomain, signAddress) => {
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
      let encodedParams = eth.abi.encodeParameters(paramTypeList, paramList);
      encodedParams = encodedParams.replace('0x', '');
      let data = '0x' + sig.toString('hex') + encodedParams.toString('hex');
      let ret = await _constructAndSignTx(data, signAddress);
      return ret;
    }
    catch (e) {
      console.log('construct createSubdomain tx error:', e);
      return null;
    }
  },
}

async function _constructAndSignTx(data, from, value = '0x0') {
  return new Promise(async (resolve, reject) => {
    console.log('from address:', from);
    let nonce = await coinAPI.getNonce(from);
    let fee = await coinAPI.getFeeRate();
    const txParams = {
      nonce: nonce.data.nonce,
      gasPrice: fee.data.ETH.medium,
      gasLimit: config.txCreator.ETH.gasLimit,
      to: config.plutx.dnsContract.address,
      value,
      data
    };
    console.log(txParams);
    let tx = new Transaction(txParams, { chain: config.txCreator.ETH.testNet === 1 ? 'ropsten' : 'mainnet' });
    console.log('unsigned tx_raw:', tx.serialize().toString('hex'));
    let { tx_raw, tx_id } = await txCreator.sign({ raw: tx.serialize().toString('hex') });
    // console.log('signed tx_raw:', tx_raw);
    resolve({ tx_raw: '0x' + tx.serialize().toString('hex') });
  })
}

async function _sign(unsignedSig) {
  return new Promise(async (resolve, reject) => {
    let sig = await txCreator.signMessage({ raw: unsignedSig });
    console.log('sig:', sig);
    if (sig) resolve(sig);
    else reject('Sign domain admin signature failed');
  })
}

async function _getSig (subdomain, crypto) {
  try {
    const unsignedSig = utils.soliditySha3(config.plutx.domain, {"type" : 'string', "value" : subdomain}, crypto);
    console.log(config.plutx.domain, subdomain, crypto);
    // console.log('unsigned sig:', unsignedSig);
    return await _sign(unsignedSig);
  }
  catch (e) {
    console.log('get domain admin signature error:', e);
    return null;
  }
}