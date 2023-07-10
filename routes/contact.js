var express = require('express');
// const { stat } = require('fs');
var axios = require("axios")
var router = express.Router();
require('dotenv').config();

const nodemailer = require('nodemailer');

async function sendEmail(senderEmail, recipientEmail, subject, message) {
  try {
    const SMTP_Server = 'smtp.gmail.com';
    const SMTP_ID = 'koicode@koicode.co.kr';
    const SMTP_PW = 'qjxdccsayunhyjwm';

    // SMTP 전송 설정
    const transporter = nodemailer.createTransport({
      host: SMTP_Server,
      port: 587,
      secure: false,
      auth: {
        user: SMTP_ID,
        pass: SMTP_PW
      }
    });

    // 이메일 옵션 설정
    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      text: message
    };

    // 이메일 전송
    const info = await transporter.sendMail(mailOptions);
    console.log('이메일이 성공적으로 발송되었습니다.');
    console.log('Message ID:', info.messageId);
    return { status: 1, messageId: info.messageId }
  } catch (error) {
    console.log('이메일 발송 중 오류가 발생했습니다.');
    console.log(error);
    return { status: -1, messageId: info.messageId }

  }
}

// Google reCAPTCHA 검증 함수
async function verifyRecaptcha(token) {
  const siteKey = 'YOUR_RECAPTCHA_SITE_KEY';
  const secretKey = process.env.GOOGLE_RECAPTCHA_KEY;

  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: secretKey,
      response: token,
    },
  });

  return response.data.success;
}



/* GET users listing. */
router.post('/email', async function (req, res, next) {
  // return false;
  try {
    const contactInfo = req.body;
    console.log('contactInfo', contactInfo)
    const senderEmail = contactInfo.email;
    const recipientEmail = 'koicode@koicode.co.kr';
    const subject = `[KOI-CODE]홈페이지에서 ${contactInfo.name}님의 문의 요청이 들어왔습니다.`;
    const message = contactInfo.text + `\r\r\r 이메일 :${contactInfo.email}`;

    const isRecaptchaVerified = await verifyRecaptcha(req.body.recaptchaToken);
    if (!isRecaptchaVerified) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA 검증에 실패했습니다.' });

    } else {

      const { status } = sendEmail(senderEmail, recipientEmail, subject, message);
      if (status === -1) {
        res.status(500).send({ status: "failse", message: "Failed to send email" });

      }
      res.status(200).send({ status: "success" });
    }


  } catch (error) {
    console.error('Error Occured at /contact/email', error);
  }

});

module.exports = router;
