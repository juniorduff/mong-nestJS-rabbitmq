import * as sgMail from '@sendgrid/mail';

export async function sendEmail(to: string, subject: string, text: string) {
  sgMail.setApiKey(
    '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',
  );
  const msg = {
    to,
    from: 'junior_duff_sm@hotmail.com',
    subject: 'Sending with SendGrid is Fun',
    text,
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
}
