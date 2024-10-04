const express = require('express');
const { auth } = require('../utils/middleware');
const {
  getUser,
  setUserAvatar,
  removeUserAvatar,
  getUsernameById,
} = require('../controllers/user');

const router = express.Router();

router.get('/:username', getUser);
router.post('/avatar', auth, setUserAvatar);
router.delete('/avatar', auth, removeUserAvatar);
router.get('/name/:id',getUsernameById)

module.exports = router;
