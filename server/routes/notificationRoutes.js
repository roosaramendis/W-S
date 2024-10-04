const express = require('express');
const { getNotificationsByUser, createNotification, deleteNotification, updateNotification } = require('../controllers/notificationController');

const router = express.Router();

// GET notifications for a specific user
router.get('/:userId', getNotificationsByUser);
router.post('/create', createNotification);
router.delete('/:id', deleteNotification);
router.put('/markAsRead/:id', updateNotification);


module.exports = router;
