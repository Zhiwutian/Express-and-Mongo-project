const State = require('../model/States');
const stateData = require('../model/statesData.json');

const verifyStateCode = (code) => {
  for (const state of stateData){
    if (state.code === code){
      return true;
    }
  }
  return false;
}

const verifyFunFactIndex = async (state, index) => {
  try {
    const funFacts = await State.find({ stateCode: state });
    const totalFacts = funFacts[0]?.funfacts?.length;
    if (!totalFacts || index > totalFacts) {
      return false;
    }
    return true;
  } catch (err){
    console.error(err);
  }
}

const verifyFunFactsExist = async (state) => {
  try {
    const funFacts = await State.find({ stateCode: state });
    const totalFacts = funFacts[0]?.funfacts?.length;
    if (!totalFacts) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
  }
}

const generateRandomIndex = (min = 0, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}


const readFunFact = async (req, res) => {
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
    const isFacts = await verifyFunFactsExist(state);
    if(isFacts){
      const factsState = await State.findOne({stateCode:state});
      const randomFactIndex = generateRandomIndex(0, factsState.funfacts.length-1);
      res.status(200).json({funfact:factsState.funfacts[randomFactIndex]});
    } else {
      const stateRequested = stateData.find(stateObj => stateObj.code === state);
      return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateRequested?.state}` });
    }
  } catch (err){
    console.log(err);
  }


}

const createFunFact = async (req, res) => {
  const state = req?.params?.state;
  if(!state){
    return res.status(400).json({ 'message': 'state value is required' });
  }
  if(state.length > 2){
    return res.status(404).json({ 'message': 'State Code does not exist' });
  }
  if (!verifyStateCode(state)) {
    return res.status(400).json({ 'message': 'Invalid state code' });
  }

  const funfacts = req?.body?.funfacts
  if(!Array.isArray(funfacts)){
    return res.status(400).json({ 'message': 'funFacts must be in an array' });
  }
  if (!funfacts.length) {
    return res.status(400).json({ 'message': 'At least one Fun Fact is required' });
  }
  try {
    const currentFacts = await State.findOne({ stateCode: state }).exec();
    console.log(currentFacts)
    if (currentFacts) {
      const allFacts = [...currentFacts.funfacts, ...funfacts];
      const update = {
        funfacts: allFacts
      };
      const result = await State.findByIdAndUpdate({ _id: currentFacts._id }, update, { returnDocument: 'after' } ).exec();
      return res.status(201).json(result);
    } else {
        const result = await State.create({
          stateCode: state,
          funfacts
        });
        res.status(201).json(result);
    }
  } catch (err) {
    console.error(err);
  }
}

const updateFunFact = async (req, res) => {
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

  const {funfact, index} = req?.body;

  if (index <= 0 || !Number.isInteger(index)){
    return res.status(400).json({ 'message': 'index must be a positive integer value'});
  }

  if (!funfact || !String(funfact) || !funfact.length){
    return res.status(400).json({ 'message': 'State fun fact value required' });
  }
  try {
    const isValid = await verifyFunFactIndex(state, index);
    const factIndex = index - 1;

    if (isValid) {
      const stateToUpdate = await State.findOne({ stateCode: state }).exec();
      const updatedFacts = stateToUpdate?.funfacts?.map((fact, index) => index === factIndex ? funfact : fact);
      const result = await State.findByIdAndUpdate({ _id: stateToUpdate.id }, { "funfacts": updatedFacts }, { returnDocument: 'after' }).exec();
      res.status(200).json(result);
    } else {
      const stateRequested = stateData.find(stateObj => stateObj.code === state);
      return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateRequested?.state}` });
    }
  } catch (err){
    console.error(err);
  }

}

const deleteFunFact = async (req, res) => {
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

  const { index } = req?.body;

  if (index <= 0 || !Number.isInteger(index)) {
    return res.status(400).json({ 'message': 'index must be a positive integer value' });
  }

  try {
    const isValid = await verifyFunFactIndex(state, index);
    const factIndex = index - 1;

    if (isValid) {
      const stateToUpdate = await State.findOne({ stateCode: state }).exec();
      const updatedFacts = stateToUpdate?.funfacts?.filter((fact, index) => index !== factIndex);
      const result = await State.findByIdAndUpdate({ _id: stateToUpdate.id }, { "funfacts": updatedFacts }, { returnDocument: 'after' }).exec();
      res.status(200).json(result);
    } else {
      const stateRequested = stateData.find(stateObj => stateObj.code === state);
      return res.status(404).json({ 'message': `No Fun Fact found at that index for ${stateRequested?.state}` });
    }
  } catch (err) {
    console.error(err);
  }


}




module.exports = {
  readFunFact,
  createFunFact,
  updateFunFact,
  deleteFunFact
}
