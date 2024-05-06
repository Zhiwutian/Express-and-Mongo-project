const State = require('../model/States');
const stateData = require('../model/statesData.json');

const verifyStateCode = (code) => {
  for (const state of stateData) {
    if (state.code === code) {
      return true;
    }
  }
  return false;
}

const buildStateData = async () => {
  try {
    const mongoStates = await State.find({});
    const allStateData = stateData.map((state) => {
      const funFacts = mongoStates.filter((mongoState) => mongoState.stateCode === state.code);
      if (funFacts.length) {
        state.funfacts = funFacts[0].funfacts
        return state;
      } else {
        return state
      }
    });
    return allStateData;
  } catch (err) {
    console.error(err);
  }


}


const getAllStateData = async (req, res) => {
  const { contig } = req.query;

  try {
    const allStateData = await buildStateData();
    console.log(allStateData)
    if(contig === 'true'){
      console.log("contig is true");
      const contigData = allStateData.filter(state => {
        if (state.code !== 'AK' && state.code !== 'HI'){
          return state
        }
      })
      return res.status(200).json(contigData);
    }

    if(contig === 'false') {
      console.log("contig is false");
      const nonContigData = allStateData.filter(state => {
        if (state.code === 'AK' || state.code === 'HI') {
          return state
        }
      })
      return res.status(200).json(nonContigData);
    }
    res.status(200).json(allStateData);
  }catch (err) {
    console.log(err);
  }
}

const getStateData = async (req, res) => {
  const state = req?.params?.state;
  if (!state) {
    return res.status(400).json({ 'message': 'state value is required' });
  }
  if (state.length > 2) {
    return res.status(404).json({ 'message': 'State Code does not exist' });
  }
  if (!verifyStateCode(state)) {
    return res.status(400).json({ 'message': 'Invalid state code' });
  }
  const allStateData = await buildStateData();
  const singleState = allStateData.filter((stateVal)=> stateVal.code === state)
  res.status(200).json(singleState[0]);


}

const getStateCapital = async (req, res) => {
  const state = req?.params?.state;
  if (!state) {
    return res.status(400).json({ 'message': 'state value is required' });
  }
  if (state.length > 2) {
    return res.status(404).json({ 'message': 'State Code does not exist' });
  }
  if (!verifyStateCode(state)) {
    return res.status(400).json({ 'message': 'Invalid state code' });
  }
  try {
    const allStateData = await buildStateData();
    const singleState = allStateData.filter((stateVal) => stateVal.code === state)
    res.status(200).json({ 'state': singleState[0].state, 'capital': singleState[0].capital_city });
  } catch (err) {
    console.error(err);
  }
}

const getStateNickname = async (req, res) => {
  const state = req?.params?.state;
  if (!state) {
    return res.status(400).json({ 'message': 'state value is required' });
  }
  if (state.length > 2) {
    return res.status(404).json({ 'message': 'State Code does not exist' });
  }
  if (!verifyStateCode(state)) {
    return res.status(400).json({ 'message': 'Invalid state code' });
  }
  try {
    const allStateData = await buildStateData();
    const singleState = allStateData.filter((stateVal) => stateVal.code === state)
    res.status(200).json({ 'state': singleState[0].state, 'nickname': singleState[0].nickname });
  } catch (err) {
    console.error(err);
  }
}

const getStatePopulation = async (req, res) => {
  const state = req?.params?.state;
  if (!state) {
    return res.status(400).json({ 'message': 'state value is required' });
  }
  if (state.length > 2) {
    return res.status(404).json({ 'message': 'State Code does not exist' });
  }
  if (!verifyStateCode(state)) {
    return res.status(400).json({ 'message': 'Invalid state code' });
  }
  try {
    const allStateData = await buildStateData();
    const singleState = allStateData.filter((stateVal) => stateVal.code === state)
    res.status(200).json({ 'state': singleState[0].state, 'population': singleState[0].population });
  } catch (err) {
    console.error(err);
  }
}

const getStateAdmitDate = async (req, res) => {
  const state = req?.params?.state;
  if (!state) {
    return res.status(400).json({ 'message': 'state value is required' });
  }
  if (state.length > 2) {
    return res.status(404).json({ 'message': 'State Code does not exist' });
  }
  if (!verifyStateCode(state)) {
    return res.status(400).json({ 'message': 'Invalid state code' });
  }
  try {
    const allStateData = await buildStateData();
    const singleState = allStateData.filter((stateVal) => stateVal.code === state)
    res.status(200).json({ 'state': singleState[0].state, 'admitted': singleState[0].admission_date });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  getAllStateData,
  getStateData,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmitDate
}
