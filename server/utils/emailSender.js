const emailSender = async ({
    senderEmail,
    subject,
    html,
  }) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: senderEmail,
      subject: subject,
      html: html,
    };
  
    await transporter.sendMail(mailOptions);
  };
export default emailSender