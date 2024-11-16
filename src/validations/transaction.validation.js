const Joi = require('joi');
const { evmaddress, txHash,anyHex } = require('./custom.validation');

const fetchQuote = {
  body: Joi.object().keys({
    inputNetwork: Joi.number().required(),
    outputNetwork: Joi.number().required(),
    inputTokenAmount: Joi.number().required().unsafe()
  }),
};

const notifyEvent = {
  body: Joi.object().keys({
    inputNetwork: Joi.number().required(),
    eventTxHash:Joi.custom(txHash).required(),
  }),
};

const fetchPortfolio = {
    params: Joi.object().keys({
      address: Joi.custom(evmaddress).required(),
    }),
  };

  const getPools = {
    params: Joi.object().keys({
      useraddress: Joi.custom(evmaddress),
    }),
  };

  const submitTransaction = {
    body: Joi.object().keys({
      transactionHash: Joi.custom(txHash).required(),
      inputNetwork: Joi.number().required(),
    }),
  };

  const manualSubmit = {
    body: Joi.object().keys({
      transactionHash: Joi.custom(txHash).required(),
      inputNetwork: Joi.number(),
    }),
  };

  const intract = {
    body: Joi.object().keys({
      address: Joi.custom(evmaddress).required(),
    }),
  };


  const updateTransaction = {
    body: Joi.object().keys({
      outputTransactionHash: Joi.custom(txHash).required(),
      bridgeHash: Joi.string().required(),
      gasyardkey: Joi.string()
    }),
  };

  const listTranx = {
    params: Joi.object().keys({
      txid: Joi.string().hex().length(24),
    }),
    query: Joi.object().keys({
      inputAddress: Joi.custom(anyHex),
      inputChainID: Joi.number(),
      outputChainID: Joi.number(),
      search: Joi.custom(txHash),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    }),
  };




const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


module.exports = {
    fetchQuote,
    fetchPortfolio,
    submitTransaction,
    updateTransaction,
    listTranx,
    getPools,
    notifyEvent,
    manualSubmit,
    intract
};