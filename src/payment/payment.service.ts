import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { Card } from './interfaces/card.interface';
import { UserDetail } from './interfaces/user-info.interface';
export type PaymentResponse = {
  success: boolean;
  message: string;
  amount?: string;
};

@Injectable()
export class PaymentService {
  private stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }
  async payment(user: UserDetail, cardDetails: Card): Promise<PaymentResponse> {
    try {
      // User has not yet paid
      // Now create a stripe customer
      // creating strip customer
      const { name: userName, email } = user;
      const customer = await this.stripe.customers.create({
        name: userName,
        email,
      });
      const {
        name,
        number,
        exp_Month: exp_month,
        exp_Year: exp_year,
        cvc,
      } = cardDetails;
      // creating stripe token
      const card_Token = await this.stripe.tokens.create({
        card: {
          name,
          number,
          exp_month,
          exp_year,
          cvc,
        },
      });

      // creating payment source for customer
      const card = await this.stripe.customers.createSource(customer.id, {
        source: `${card_Token.id}`,
      });

      // charing cusomter for feed
      await this.stripe.charges.create({
        amount: 25 * 100, // $25
        currency: 'usd',
        customer: customer.id,
        description: 'Social Feed Payment',
        source: card.id,
      });

      //console.log(user);
      return {
        success: true,
        message: 'Social Feed Payment Successful',
        amount: `25$`,
      };
    } catch (err) {
      return { success: false, message: `Error: ${err.message}` };
    }
  }
}
