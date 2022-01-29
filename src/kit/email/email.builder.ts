import * as dotenv from 'dotenv';

dotenv.config();

const EmailBuilder = {
  confirmRegisterEmail: (verification_code) => `
    <html>this is confirm register email. Verifiy your email by clicking this <a href="${process.env.APP_URL}/signin?email_verify=${verification_code}">link</a><br/></html>
  `
}

export default EmailBuilder;