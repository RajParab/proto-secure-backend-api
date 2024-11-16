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

    const findIfExists = await DappContract.find({ guid: formData.guid });
    if (findIfExists.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Already exists' });
    }
    const guid = generateGUID();
    const createProject = await DappContract.create({
      guid: guid,
      projectName: formData.projectName,
      logoURL: formData.logoURL,
      bountyAmt: formData.bountyAmt,
      tokenSymbol: formData.tokenSymbol,
      mediatator: formData.mediatator,
      status: formData.status,
      email: formData.email,
    });

    if (createProject) {
      return res.status(httpStatus.OK).json(guid);
    }
  } catch (e) {
    console.log(e.message);
  }
});

const updateDappForm = catchAsync(async (req, res) => {
  const formData = req.body.formData;
  if (!formData) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Error: Invalid Form' });
  }

  const findIfExists = await DappContract.find({ guid: formData.guid });
  if (findIfExists.length == 0) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Dowsnt exists' });
  }

  const updateForm = await DappContract.updateOne(
    { guid: formData.guid },
    { transactionHash: formData.transactionHash, contractAddress: formData.contractAddress, chainID: formData.chainID }
  );

  if (updateForm) {
    return res.status(httpStatus.OK).json({ message: 'Update Succuessful' });
  }
});

const changeStatus = catchAsync(async (req, res) => {
  const contractBody = req.body.contractBody;

  if (contractBody.transactionHash) {
    const udpateStatus = await DappContract.updateOne(
      { transactionHash: contractBody },
      {
        status: contractBody.status,
      }
    );

    if (udpateStatus) {
      return req.status(httpStatus.OK).json({ message: 'Update Status Successfully' });
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

module.exports = {
  addProjectForm,
  updateDappForm,
  listDapps,
  changeStatus,
};
