const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { DappContract, Comment } = require('../models');
const { generateGUID } = require('../helpers/CommonHelper');
const { http } = require('winston');

const APP_ID = process.env.NILLION_APP_ID;
const USER_SEED = process.env.NILLION_USER_SEED; // generates a deterministic nillion user id; use any string
const API_BASE = 'https://nillion-storage-apis-v0.onrender.com';

const PROJECT_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  RETIRED: 'retired',
};

const addProjectForm = catchAsync(async (req, res) => {
  try {
    const formData = req.body.formData;
    if (!formData) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Error: Invalid Form' });
    }

    const guid = generateGUID();
    // const findIfExists = await DappContract.find({ contractAddress: formData.contractAddress, chainID: formData.chainID });
    // if (findIfExists.length > 0) {
    //   return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Already exists' });
    // }
    const createProject = await DappContract.create({
      guid: guid,
      projectName: formData.projectName,
      logoURL: formData.logoURL,
      bountyAmt: formData.bountyAmt,
      tokenSymbol: formData.tokenSymbol,
      mediatator: formData.mediatator.toLowerCase(),
      email: formData.email,
      contractAddress: formData.contractAddress.toLowerCase(),
      chainID: formData.chainID,
    });

    if (createProject) {
      return res.status(httpStatus.OK).json(formData.contractAddress.toLowerCase());
    }
  } catch (e) {
    console.log(e.message);
  }
});

const updateDappForm = catchAsync(async (req, res) => {
  const chainID = req.params.chainID;
  const formData = req.body[0];

  console.log(formData);
  const status = determineStatus(formData.data.event.name);

  const contractAddress = formData.data.event.contract.address;
  console.log(contractAddress)
  const findIfExists = await DappContract.find({ contractAddress: contractAddress.toLowerCase() });
  if (findIfExists.length == 0) {
    console.log("Project not extist");
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Dowsnt exists' });
  }

  const updateForm = await DappContract.updateOne(
    { contractAddress: contractAddress.toLowerCase(), chainID: chainID },
    { transactionHash: formData.data.transaction.txHash, status: status, productID: formData.data.event.inputs[0].value }
  );

  if (updateForm) {
    return res.status(httpStatus.OK).json({ message: 'Update Succuessful' });
  }
});

const changeStatus = catchAsync(async (req, res) => {
  const contractBody = req.body[0];
  const chainID = req.params.chainID;

  console.log(contractBody);
  const contractAddress = contractBody.data.event.contract.address;
  const status = determineStatus(contractBody.data.event.name);
  if (contractBody.data.transaction.txHash) {
    const udpateStatus = await DappContract.updateOne(
      { contractAddress: contractAddress.toLowerCase(), chainID: parseInt(chainID) },
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

const addDeploymentComment = catchAsync(async (req, res) => {
  const comment = req.body.comment;
  const contractAddress = req.body.contractAddress.toLowerCase();

  const storeResult2 = await fetch(`${API_BASE}/api/apps/${APP_ID}/secrets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: {
        nillion_seed: USER_SEED,
        secret_value: comment,
        secret_name: contractAddress,
      },
      permissions: {
        retrieve: [],
        update: [],
        delete: [],
        compute: {},
      },
    }),
  }).then((res) => res.json());

  const createComment = await Comment.create({ storeID: storeResult2.store_id, contractAddress: contractAddress });
  if (createComment) {
    return res.status(httpStatus.OK).json('Stored Successfully');
  }
});

const retrieveDeploymentComment = catchAsync(async (req, res) => {
  const contractAddress = req.body.contractAddress.toLowerCase();
  const findComment = await Comment.findOne({ contractAddress: contractAddress });

  const secret1 = await fetch(
    `${API_BASE}/api/secret/retrieve/${findComment.storeID}?retrieve_as_nillion_user_seed=${USER_SEED}&secret_name=${contractAddress}`
  ).then((res) => res.json());

  return res.status(httpStatus.OK).json(secret1.secret);
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
  addDeploymentComment,
  retrieveDeploymentComment,
};
