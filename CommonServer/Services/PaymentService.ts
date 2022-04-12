import Email from 'Common/Types/email';
import payment from '../config/payment';
import Stripe from 'stripe';
import BadDataException from 'Common/Types/Exception/BadDataException';
const stripe = Stripe(payment.paymentPrivateKey);
import Plans from '../config/plans';
import ProjectService from './ProjectService';
import ProjectModel from '../Models/project';
import StripeService from './StripeService';
import NotificationService from './NotificationService';
import {
    getAlertChargeAmount,
    getCountryType,
    Call,
} from '../config/alertType';
// import getMutex from '../constants/mutexProvider'

import { formatBalance } from '../Utils/number';
// import MUTEX_RESOURCES from '../constants/MUTEX_RESOURCES'

export default class Service {
    /**
     * charges a project for an alert
     * @param {(object | string)} userId owner of the project
     * @param {object} project project to cut balance from
     * @param {string} alertType the type of alert to use
     * @param {string} alertPhoneNumber phone number of the recipient
     * @returns { (Promise<{error : (string) }> | Promise< {closingBalance : number, chargeAmount:number}>} an object containing error or closing balance and charge amount
     */
    async chargeAlertAndGetProjectBalance(
        userId,

        project,

        alertType,

        alertPhoneNumber,
        segments = 1
    ) {
        // let release;
        try {
            // const mutex = getMutex(
            //     MUTEX_RESOURCES.PROJECT,
            //     project._id.toString()
            // );
            // release = await mutex.acquire();

            const countryType = getCountryType(alertPhoneNumber);
            const alertChargeAmount = getAlertChargeAmount(
                alertType,
                countryType
            );
            const chargeAmount =
                alertType === Call
                    ? alertChargeAmount.price
                    : alertChargeAmount.price * segments;

            const updatedProject = await this.chargeAlert(
                userId,
                project._id,
                chargeAmount
            );

            return {
                chargeAmount,
                closingBalance: updatedProject.balance,
            };
        } catch (error) {
            return { error: 'Could not charge alert' };
        } finally {
            // if (release) {
            //     release();
            // }
        }
    }
    /**
     *checks whether a project's balance is enough
     *
     * @param {*} projectId ID of project
     * @param {*} alertPhoneNumber alertNumber
     * @param {*} userId ID of user
     * @param {*} alertType type of alert
     * @return {boolean} whether the project has enough balance
     */
    async hasEnoughBalance(
        projectId,

        alertPhoneNumber,

        userId,

        alertType
    ) {
        try {
            const project = await ProjectService.findOneBy({
                query: { _id: projectId },
                select: 'balance alertOptions',
            });
            const balance = project.balance;
            const countryType = getCountryType(alertPhoneNumber);
            const alertChargeAmount = getAlertChargeAmount(
                alertType,
                countryType
            );

            const customThresholdAmount = project.alertOptions
                ? project.alertOptions.minimumBalance
                : null;

            const isBalanceMoreThanMinimum =
                balance > alertChargeAmount.minimumBalance;
            if (customThresholdAmount) {
                const isBalanceMoreThanCustomThresholdAmount =
                    balance > customThresholdAmount;
                return (
                    isBalanceMoreThanMinimum &&
                    isBalanceMoreThanCustomThresholdAmount
                );
            }
            return isBalanceMoreThanMinimum;
        } catch (error) {
            return false;
        }
    }

    /**
     * rechargest the project with the amount set in the project's alert options
     * @param {*} userId current user id
     * @param {*} project project to add blance to
     * @returns {boolean} whether the balance is recharged to the project
     */

    async fillProjectBalance(userId, project): void {
        try {
            let balanceRecharged;

            const rechargeAmount = project.alertOptions
                ? project.alertOptions.rechargeToBalance
                : null;
            if (rechargeAmount) {
                balanceRecharged = await StripeService.addBalance(
                    userId,
                    rechargeAmount,
                    project._id.toString()
                );

                return balanceRecharged;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
    /**
     * synchronously recharges a project balance if low
     * @param {*} projectId ID of the project to check and recharge balance
     * @param {*} userId ID of user
     * @param {*} alertPhoneNumber alertNumber
     * @param {*} alertType type of alert
     * @returns {{success : boolean, message : string}} whether the balance is recharged successfully
     */
    async checkAndRechargeProjectBalance(
        project,

        userId,

        alertPhoneNumber,

        alertType
    ) {
        // let release;
        const status = {};
        // const mutex = getMutex(
        //     MUTEX_RESOURCES.PROJECT,
        //     project._id.toString()
        // );
        // release = await mutex.acquire();
        // check balance
        const isBalanceEnough = await this.hasEnoughBalance(
            project._id,
            alertPhoneNumber,
            userId,
            alertType
        );

        if (!isBalanceEnough) {
            const lowBalanceRecharged = await this.fillProjectBalance(
                userId,
                project
            );
            if (lowBalanceRecharged) {
                status.success = true;

                status.message = 'Balance recharged successfully';
            } else {
                status.success = false;

                status.message = 'Low Balance';
            }
        } else {
            status.success = true;

            status.message = 'Balance is enough';
        }

        return status;
    }

    //Description: Retrieve payment intent.
    //Params:
    //Param 1: paymentIntent: Payment Intent
    //Returns: promise

    async checkPaymentIntent(paymentIntent): void {
        const processedPaymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntent.id
        );
        return processedPaymentIntent;
    }

    //Description: Create customer in stripe for  user.
    //Params:
    //Param 1: stripeToken: Token generated from frontend
    //Param 2: user: User details
    //Returns: promise

    async createCustomer(email: Email, companyName: string): void {
        const customer = await stripe.customers.create({
            email: email,
            description: companyName,
        });
        return customer.id;
    }

    async addPayment(customerId: string): void {
        const card = await stripe.customers.createSource(customerId);
        return card;
    }

    //Description: Subscribe plan to user.
    //Params:
    //Param 1: stripePlanId: Id generated from frontend.
    //Param 2: stripeCustomerId: Stripe customer id.
    //Returns : promise

    async subscribePlan(
        stripePlanId: string,
        stripeCustomerId: string,
        coupon: string
    ): void {
        const items = [];
        items.push({
            plan: stripePlanId,
            quantity: 1,
        });

        let subscriptionObj = {};

        if (coupon) {
            subscriptionObj = {
                customer: stripeCustomerId,
                items: items,
                coupon: coupon,
                trial_period_days: 14,
            };
        } else {
            subscriptionObj = {
                customer: stripeCustomerId,
                items: items,
                trial_period_days: 14,
            };
        }

        const subscription = await stripe.subscriptions.create(subscriptionObj);
        return {
            stripeSubscriptionId: subscription.id,
        };
    }

    //Description: Call this fuction when you add and remove a team member from OneUptime. This would add and remove seats based on how many users are in the project.
    //Params:
    //Param 1: stripePlanId: Id generated from frontend.
    //Param 2: stripeCustomerId: Stripe customer id.
    //Returns : promise

    async changeSeats(subscriptionId, seats): void {
        if (subscriptionId === null) return;

        let subscription = await stripe.subscriptions.retrieve(subscriptionId);

        let plan = null;
        const items = [];
        if (
            !subscription ||
            !subscription.items ||
            !subscription.items.data ||
            !subscription.items.data.length > 0
        ) {
            throw new BadDataException(
                'Your subscription cannot be retrieved.'
            );
        } else {
            let trial_end_date;
            if (
                subscription.trial_end !== null &&
                subscription.trial_end * 1000 > Date.now() //ensure the trial end date is in the future
            ) {
                trial_end_date = subscription.trial_end;
            }

            for (let i = 0; i < subscription.items.data.length; i++) {
                plan = await Plans.getPlanById(
                    subscription.items.data[i].plan.id
                );

                if (plan) {
                    const item = {
                        plan: plan.planId,
                        id: subscription.items.data[i].id,
                        quantity: seats,
                    };

                    items.push(item);
                }
            }

            if (trial_end_date) {
                subscription = await stripe.subscriptions.update(
                    subscriptionId,
                    { items: items, trial_end: trial_end_date }
                );
            } else {
                subscription = await stripe.subscriptions.update(
                    subscriptionId,
                    { items: items }
                );
            }

            return subscription.id;
        }
    }

    async createSubscription(stripeCustomerId, amount): void {
        const productId = Plans.getReserveNumberProductId();

        const subscriptions = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [
                {
                    price_data: {
                        currency: 'usd',
                        product: productId,
                        unit_amount: amount * 100,
                        recurring: {
                            interval: 'month',
                        },
                    },
                },
            ],
        });
        return subscriptions;
    }

    async removeSubscription(stripeSubscriptionId): void {
        const confirmations = [];

        confirmations[0] = await stripe.subscriptions.del(stripeSubscriptionId);
        return confirmations;
    }

    async changePlan(subscriptionId, planId, seats): void {
        let subscriptionObj = {};

        const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
        );
        const trial_end = subscription.trial_end;

        await stripe.subscriptions.del(subscriptionId);

        const items = [];
        items.push({
            plan: planId,
            quantity: seats,
        });

        // ensure trial end date is in the future
        if (trial_end !== null && trial_end * 1000 > Date.now()) {
            subscriptionObj = {
                customer: subscription.customer,
                items: items,
                trial_end,
            };
        } else {
            subscriptionObj = {
                customer: subscription.customer,
                items: items,
            };
        }

        const subscriptions = await stripe.subscriptions.create(
            subscriptionObj
        );

        return subscriptions.id;
    }

    async chargeAlert(userId, projectId, chargeAmount): void {
        let project = await ProjectService.findOneBy({
            query: { _id: projectId },
            select: 'balance alertOptions _id',
        });
        const { balance } = project;
        const { minimumBalance, rechargeToBalance } = project.alertOptions;
        if (balance < minimumBalance) {
            const paymentIntent = await StripeService.chargeCustomerForBalance(
                userId,
                rechargeToBalance,
                project.id
            );
            if (!paymentIntent.paid) {
                //create notification
                const message =
                    'Your balance has fallen below minimum balance set in Alerts option. Click here to authorize payment';
                const meta = {
                    type: 'action',
                    client_secret: paymentIntent.client_secret,
                };

                NotificationService.create(
                    projectId,
                    message,
                    userId,
                    null,
                    meta
                );
            }

            // confirm payment intent
            // and update the project balance
            // if further process is required the user will need to manually top up the account
            await StripeService.confirmPayment(paymentIntent);
        }

        project = await ProjectService.findOneBy({
            query: { _id: projectId },
            select: 'balance',
        });
        const balanceAfterAlertSent = formatBalance(
            project.balance - chargeAmount
        );

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId,
            {
                $set: {
                    balance: balanceAfterAlertSent,
                },
            },
            { new: true }
        );
        return updatedProject;
    }

    //Description: Call this fuction to bill for extra users added to an account.
    //Params:
    //Param 1: stripeCustomerId: Received during signup process.
    //Returns : promise
    async chargeExtraUser(
        stripeCustomerId,

        extraUserPlanId,

        extraUsersToAdd
    ) {
        const subscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [
                {
                    plan: extraUserPlanId,
                    quantity: extraUsersToAdd,
                },
            ],
        });
        return subscription;
    }
}
