const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const evmaddress = (value, helpers) => {
  if (!value.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
    return helpers.message('"{{#label}}" must be a EVM WalletAddress');
  }
  return value;
};

const txHash = (value, helpers) => {
  if (!value.match(/^(0x)?[0-9a-fA-F]{64}$/)) {
    return helpers.message('"{{#label}}" must be a EVM TransactionHash');
  }
  return value;
};

const anyHex = (value, helpers) => {
  if (!value.match(/^(0x)?[0-9a-fA-F]+$/)) {
    return helpers.message('"{{#label}}" must be a EVM TransactionHash');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  evmaddress,
  txHash,
  anyHex
};
