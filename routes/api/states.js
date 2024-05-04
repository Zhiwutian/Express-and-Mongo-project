const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

// router.route('/')
//   .get(statesController)
//   .post(statesController)
//   .put(statesController)
//   .delete(statesController);

router.route('/:state/funfact')
  // .get(statesController)
  // .post()
  // .patch()
  // .delete();

module.exports = router;
