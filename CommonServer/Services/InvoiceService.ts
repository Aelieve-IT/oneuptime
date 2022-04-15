import BadDataException from 'Common/Types/Exception/BadDataException';
export default class Service {
    //Description: Call this fuction to retrieve list of invoices for a customer.
    //Params:
    //Param 1: stripeCustomerId: Received from the frontend.
    //Param 2: projectId: Project id from req.params.
    //Param 3: startingAfter: A cursor for use in pagination. startingAfter is an object ID
    //         that helps to fetch items fro the next list.
    //Returns : promise

    async get(userId, startingAfter, endingBefore): void {
        const user: $TSFixMe = await UserService.findOneBy({
            query: { _id: userId },
            select: 'stripeCustomerId',
        });
        if (!user) {
            throw new BadDataException('User not found.');
        } else {
            const invoices: $TSFixMe = await stripe.invoices.list({
                customer: user.stripeCustomerId,
                limit: 10,
                starting_after: startingAfter,
                ending_before: endingBefore,
            });
            if (!invoices || !invoices.data) {
                throw new BadDataException('Your invoice cannot be retrieved.');
            }
            return invoices;
        }
    }
}

import payment from '../config/payment';
import Stripe from 'stripe';
const stripe: $TSFixMe = Stripe(payment.paymentPrivateKey);
import UserService from './UserService';