const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const dappContractSchema = mongoose.Schema(
  {
    guid: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      default: null
    },
    projectName: {
      type: String,
      default: null
    },
    logoURL: {
      type: String,
      default: null
    },
    bountyAmt: {
      type: Number,
      required: true
    },
    tokenSymbol: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      default: null
    },
    mediatator: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    contractAddress: {
      type: String,
      default: null,
    },
    chainID: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
dappContractSchema.plugin(toJSON);
dappContractSchema.plugin(paginate);

const DappContract = mongoose.model('DappContract', dappContractSchema);

module.exports = DappContract;