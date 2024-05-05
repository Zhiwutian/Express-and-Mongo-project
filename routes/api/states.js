const express = require('express');
const router = express.Router();
const funfactsController = require('../../controllers/funfactsController');
const statesController = require('../../controllers/statesController');

router.route('/')
  .get(statesController.getAllStateData);

router.route('/:state')
  .get(statesController.getStateData);

router.route('/:state/capital')
  .get(statesController.getStateCapital);

router.route('/:state/funfact')
  .get(funfactsController.readFunFact)
  .post(funfactsController.createFunFact)
  .patch(funfactsController.updateFunFact)
  .delete(funfactsController.deleteFunFact);

router.route('/:state/nickname')
  .get(statesController.getStateNickname);

router.route('/:state/population')
  .get(statesController.getStatePopulation);

router.route('/:state/admission')
  .get(statesController.getStateAdmitDate);


module.exports = router;
