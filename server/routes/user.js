const express = require('express');
const User = require('../models/user');
const { auth } = require('../utils/middleware');
const {
  getUser,
  setUserAvatar,
  removeUserAvatar,
  updateUser,
  updatebirthyear,
  getUsernameById,
  updateUserRole,
} = require('../controllers/user');

const router = express.Router();

router.get('/:username', getUser);
router.post('/avatar', auth, setUserAvatar);
router.delete('/avatar', auth, removeUserAvatar);
router.put('/user-name', updateUser);

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(204).end();  // Success, no content
  } catch (error) {
    res.status(500).send({ error: 'Server error while deleting user' });
  }
});
router.put('/birth-year', updatebirthyear);
router.put('/user-role', updateUserRole);
router.get('/name/:id',getUsernameById)

module.exports = router;
