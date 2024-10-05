const Notification = require('../models/Notification');
const nodemailer = require('nodemailer'); 


const emailSender = async ({
  reciverEmail,
  subject,
  html,
}) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or your email service
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: reciverEmail,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};
// Get notifications for a specific user
exports.getNotificationsByUser = async (req, res) => {
    const userId = req.params.userId; // Extract userId from req.params
    console.log('Received userId:', userId); // Log the userId for debugging
    try {
      const notifications = await Notification.find({ reciverId: userId }).sort({ time: -1 });
      console.log('Fetched notifications:', notifications); // Log the fetched notifications
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error); // Log the error
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  };

// Create a new notification
exports.createNotification = async (req, res) => {
  const { reciverId, senderId, reciverEmail, title, description } = req.body;
  console.log( reciverEmail);
  try {
    const newNotification = new Notification({
        reciverId,
        senderId,
        title,
        description,
    });
    await newNotification.save();
    await emailSender({
      reciverEmail: reciverEmail, // Send email to the receiver's email
      subject: `New Notification: ${title}`, // Email subject
      html: `<h1>${title}</h1><p>${description}</p><p>Check your notifications for more details.</p>`, // Email content
    })
    res.status(200).json("dsfdsfs");
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Delete a notification by its ID
exports.deleteNotification = async (req, res) => {
    const { id } = req.params; // Extract the notification ID from request parameters
    console.log('Deleting notification with ID:', id); // Log the ID for debugging
    try {
      const deletedNotification = await Notification.findByIdAndDelete(id); // Find and delete the notification
      if (deletedNotification) {
        res.status(200).json({ message: 'Notification deleted successfully', deletedNotification });
      } else {
        res.status(404).json({ message: 'Notification not found' });
      }
    } catch (error) {
      console.error('Error deleting notification:', error); // Log the error
      res.status(500).json({ message: 'Error deleting notification', error });
    }
  };

// Update a notification to toggle isRead status
exports.updateNotification = async (req, res) => {
  const { id } = req.params; // Get notification ID from request params
  try {
    const notification = await Notification.findById(id); // Find the notification by ID
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Toggle the isRead status
    notification.isRead = !notification.isRead;

    await notification.save(); // Save the updated notification

    res.status(200).json({
      message: 'Notification updated successfully',
      notification,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification', error });
  }
};
