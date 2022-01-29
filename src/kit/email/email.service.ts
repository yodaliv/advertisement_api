import { BadRequestException, Injectable } from '@nestjs/common';
// import * as aws from 'aws-sdk';

import EmailBuilder from './email.builder';
const formData = require('form-data');
const Mailgun = require('mailgun.js');

import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});
@Injectable()
export class EmailService {
  constructor() {
    
  }

  
  async sendEmail(to, subject, content) {
    var messageData = {
      from: 'noreply@bksbackstage.io',
      to: to,
      subject: subject,
      html: content
    }

    client.messages.create(DOMAIN, messageData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  sendConfirmRegisterEmail(email: string, verification_code) {
    const content = EmailBuilder.confirmRegisterEmail(verification_code);
    this.sendEmail(email, 'Confirm Register', content);
  }

  async sendForgotPasswordEmail(email: string, temporaryPassword: string) {
    // this.sendEmail(forgotPasswordEmail(email, temporaryPassword));
  }
}
