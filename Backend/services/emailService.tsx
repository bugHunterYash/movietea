import React from 'react';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { PrismaClient } from '@prisma/client';

import { WelcomeEmail } from '../emails/templates/WelcomeEmail';
import { OrderConfirmation } from '../emails/templates/OrderConfirmation';
import { PreorderConfirmation } from '../emails/templates/PreorderConfirmation';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_if_missing');
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'MOVITEA <hello@movitea.com>';

async function logEmailEvent(resendData: any, resendError: any, type: string, recipient: string, subject: string, template: string, relatedIds: any = {}) {
  try {
    const status = resendError ? 'FAILED' : 'SENT';
    const failedReason = resendError ? (resendError.message || JSON.stringify(resendError)) : null;

    await prisma.emailLog.create({
      data: {
        resendId: resendData?.id || null, // Might be null if failed instantly
        type,
        recipient,
        subject,
        template,
        status,
        failedReason,
        userId: relatedIds.userId || null,
        orderId: relatedIds.orderId || null,
        preorderId: relatedIds.preorderId || null,
      }
    });
  } catch (error) {
    console.error('Failed to log email to database:', error);
  }
}

export const sendWelcomeEmail = async (userEmail: string, userName: string, userId?: string) => {
  try {
    const html = await render(<WelcomeEmail userName={userName} />);
    const subject = 'Welcome to MOVITEA ☕';

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: userEmail,
      subject,
      html,
    });

    await logEmailEvent(data, error, 'WELCOME', userEmail, subject, 'WelcomeEmail', { userId });

    if (error) {
      console.error('Welcome email error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    await logEmailEvent(null, error, 'WELCOME', userEmail, 'Welcome to MOVITEA ☕', 'WelcomeEmail', { userId });
    return null;
  }
};

export const sendOrderConfirmationEmail = async (order: any, userEmail: string) => {
  try {
    const html = await render(
      <OrderConfirmation 
        orderNumber={order.orderNumber}
        customerName={order.customerName}
        items={order.items}
        totalAmount={order.totalAmount}
        address={`${order.address1}, ${order.city}`}
        paymentMethod={order.paymentMethod}
      />
    );
    const subject = 'Order Confirmed 🎉';

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: userEmail || order.customerEmail,
      subject,
      html,
    });

    await logEmailEvent(data, error, 'ORDER_CONFIRMATION', userEmail || order.customerEmail, subject, 'OrderConfirmation', { orderId: order.id, userId: order.userId });

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Failed to send order email:', error);
    await logEmailEvent(null, error, 'ORDER_CONFIRMATION', userEmail || order.customerEmail, 'Order Confirmed 🎉', 'OrderConfirmation', { orderId: order.id, userId: order.userId });
    return null;
  }
};

export const sendPreorderEmail = async (preorder: any) => {
  try {
    const html = await render(
      <PreorderConfirmation 
        customerName={preorder.name}
        productName={preorder.product?.name || 'Your Tea'}
        referenceId={preorder.referenceId}
        status={preorder.status}
      />
    );
    const subject = "We've received your preorder";

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: preorder.email,
      subject,
      html,
    });

    await logEmailEvent(data, error, 'PREORDER', preorder.email, subject, 'PreorderConfirmation', { preorderId: preorder.id });

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Failed to send preorder email:', error);
    await logEmailEvent(null, error, 'PREORDER', preorder.email, "We've received your preorder", 'PreorderConfirmation', { preorderId: preorder.id });
    return null;
  }
};
