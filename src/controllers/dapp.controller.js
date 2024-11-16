const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { DappContract } = require('../models');
const { generateGUID } = require('../helpers/CommonHelper');

const PROJECT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  RETIRED: 'retired',
};

const MAINTAINER_ENUM = {
  GOV: 'gov',
  SEAL911: 'seal_911',
  PROTO_SECURE: 'proto_secure',
};

const addProjectForm = catchAsync(async (req, res) => {
  try {
    const formData = req.body.formData;
    if (!formData) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Error: Invalid Form' });
    }

    const guid = generateGUID();
    const findIfExists = await DappContract.find({ contractAddress: formData.contractAddress });
    if (findIfExists.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Already exists' });
    }
    const createProject = await DappContract.create({
      guid: guid,
      projectName: formData.projectName,
      logoURL: formData.logoURL,
      bountyAmt: formData.bountyAmt,
      tokenSymbol: formData.tokenSymbol,
      mediatator: formData.mediatator,
      email: formData.email,
      contractAddress: formData.contractAddress,
      chainID: formData.chainID,
    });

    if (createProject) {
      return res.status(httpStatus.OK).json(formData.contractAddress);
    }
  } catch (e) {
    console.log(e.message);
  }
});

const updateDappForm = catchAsync(async (req, res) => {
  const chainID = req.params.chainID;
  const formData = req.body;

  console.log(formData);
  const status = determineStatus(formData.data.event.name);
  if (!formData) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Error: Invalid Form' });
  }

  const findIfExists = await DappContract.find({ contractAddress: formData.data.event.contract.address });
  if (findIfExists.length == 0) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Dowsnt exists' });
  }

  const updateForm = await DappContract.updateOne(
    { contractAddress: formData.data.event.contract.address, chainID: chainID },
    { transactionHash: formData.data.transaction.txHash, status: status }
  );

  if (updateForm) {
    return res.status(httpStatus.OK).json({ message: 'Update Succuessful' });
  }
});

const changeStatus = catchAsync(async (req, res) => {
  const contractBody = req.body;
  const chainID = req.params.chainID;

  console.log(contractBody);
  const status = determineStatus(contractBody.data.event.name);
  if (contractBody.data.transaction.txHash) {
    const udpateStatus = await DappContract.updateOne(
      { contractAddress: contractBody.data.event.contract.address, chainID: parseInt(chainID) },
      {
        transactionHash: contractBody.data.transaction.txHash,
        status: status,
      }
    );

    if (udpateStatus) {
      return res.status(httpStatus.OK).json({ message: 'Update Status Successfully' });
    }
  }
});

const listDapps = catchAsync(async (req, res) => {
  const projectName = req.params.projectName;
  if (projectName) {
    const findprojects = await DappContract.find({ projectName: projectName });
    return res.status(httpStatus.OK).json(findprojects);
  }

  const findprojects = await DappContract.find();
  return res.status(httpStatus.OK).json(findprojects);
});

const determineStatus = (functionName) => {
  if (functionName == 'ProtocolRegistered' || functionName == 'ResolutionCompleted') {
    return PROJECT_STATUS.ACTIVE;
  } else if (functionName == 'SecurityAlertRaised') {
    return PROJECT_STATUS.SUSPENDED;
  }
};

module.exports = {
  addProjectForm,
  updateDappForm,
  listDapps,
  changeStatus,
};
