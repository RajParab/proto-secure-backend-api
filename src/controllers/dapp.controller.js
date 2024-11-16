const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { DappContract } = require('../models');

const PROJECT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const addProjectForm = catchAsync(async (req, res) => {
  try {
    const formData = req.body.formData;
    if (!formData) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Error: Invalid Form' });
    }

    const findIfExists = await DappContract.find({ guid: formData.guid });
    console.log(findIfExists);
    if (findIfExists.length > 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'ERROR: Project Already exists' });
    }

    const createProject = await DappContract.create({
      guid: formData.guid,
      projectName: formData.projectName,
      logoURL: formData.logoURL,
      bountyAmt: formData.bountyAmt,
      tokenSymbol: formData.tokenSymbol,
      mediatator: formData.mediatator,
      status: formData.status,
    });

    console.log(createProject);
    if (createProject) {
      return res.status(httpStatus.OK).json({ message: 'Project Added Successfully' });
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
    { transactioHash: formData.transactioHash, contractAddress: formData.contractAddress, chainID: formData.chainID }
  );

  if (updateForm) {
    return res.status(httpStatus.OK).json({ message: 'Update Succuessful' });
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
};
