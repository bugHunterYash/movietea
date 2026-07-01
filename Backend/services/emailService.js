const { Resend } = require('resend');

// Initialize Resend using the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_if_missing');

// Resend requires sending FROM a verified domain.
// By default, if the user does not provide one, we use Resend's testing email
const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: userEmail,
      subject: 'Welcome to MOVITEA 🍵',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; border: 1px solid #EAEAEA;">
          <div style="text-align: center; padding: 40px 20px;">
            <img src="https://movitea.com/assets/logo.jfif" alt="MOVITEA" style="height: 60px; margin-bottom: 20px; mix-blend-mode: multiply;" />
            <h1 style="color: #2B1A12; font-size: 28px; font-weight: 300; margin-bottom: 10px;">Welcome to the Atelier, ${userName || 'Tea Lover'}</h1>
            <p style="color: #8A7A6B; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for joining MOVITEA. Step into a world of premium flavoured tea, crafted with sensory perfection and zero added sugar.
            </p>
            
            <div style="background-color: #FFFFFF; padding: 30px; border-radius: 8px; text-align: left; margin-bottom: 30px;">
              <h3 style="color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; margin-bottom: 15px;">Discover Our Signatures</h3>
              <ul style="color: #2B1A12; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                <li><strong>Chocolate Reserve:</strong> Decadent cacao notes</li>
                <li><strong>Vanilla Orchid:</strong> Smooth, creamy finish</li>
                <li><strong>Rose Atelier:</strong> Delicate floral aroma</li>
                <li><strong>Toasted Butterscotch:</strong> Caramelized warmth</li>
              </ul>
            </div>

            <a href="https://movitea.com" style="display: inline-block; background-color: #2B1A12; color: #FFFFFF; padding: 15px 40px; text-decoration: none; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 14px;">
              Explore Blends
            </a>
          </div>
          
          <div style="background-color: #2B1A12; color: #FFFFFF; text-align: center; padding: 30px 20px; font-size: 12px; opacity: 0.9;">
            <p style="margin-bottom: 10px;">MOVITEA &copy; ${new Date().getFullYear()}. All rights reserved.</p>
            <p>Need assistance? Contact our concierge at <a href="mailto:movitea8@gmail.com" style="color: #D4AF37; text-decoration: none;">movitea8@gmail.com</a></p>
          </div>
        </div>
      `
    });
    console.log('Welcome email sent via Resend:', data);
    return data;
  } catch (error) {
    console.error('Failed to send welcome email via Resend:', error);
    return null;
  }
};

const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #EAEAEA;">
          <strong style="color: #2B1A12;">${item.name}</strong><br/>
          <span style="color: #8A7A6B; font-size: 13px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 15px 0; text-align: right; color: #2B1A12; font-weight: 600; border-bottom: 1px solid #EAEAEA;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
    `).join('');

    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: userEmail || order.customerEmail,
      subject: 'Thank you for your order! ☕ Your MOVITEA order has been received.',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; border: 1px solid #EAEAEA;">
          <div style="text-align: center; padding: 40px 20px 20px;">
            <img src="https://movitea.com/assets/logo.jfif" alt="MOVITEA" style="height: 60px; margin-bottom: 20px; mix-blend-mode: multiply;" />
            <h1 style="color: #2B1A12; font-size: 26px; font-weight: 300; margin-bottom: 10px;">Order Received</h1>
            <p style="color: #8A7A6B; font-size: 16px;">Thank you for your purchase, ${order.customerName}.</p>
          </div>
          
          <div style="background-color: #FFFFFF; padding: 30px; margin: 0 20px 30px; border-radius: 8px; border: 1px solid #EAEAEA;">
            <div style="margin-bottom: 25px;">
              <p style="margin: 0; color: #8A7A6B; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
              <p style="margin: 5px 0 0; color: #2B1A12; font-size: 18px; font-weight: 600;">${order.id}</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${itemsList}
            </table>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #5C4B37;">
              <tr>
                <td style="padding: 10px 0;">Subtotal</td>
                <td style="padding: 10px 0; text-align: right;">₹${order.totalAmount}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;">Payment Method</td>
                <td style="padding: 10px 0; text-align: right;">${order.paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 15px 0; font-size: 18px; font-weight: 600; color: #2B1A12; border-top: 1px solid #EAEAEA;">Total Amount</td>
                <td style="padding: 15px 0; font-size: 18px; font-weight: 600; color: #2B1A12; text-align: right; border-top: 1px solid #EAEAEA;">₹${order.totalAmount}</td>
              </tr>
            </table>

            <div style="margin-top: 25px; padding: 15px; background-color: #F8F4ED; border-radius: 6px; text-align: center;">
              <p style="margin: 0; color: #D4AF37; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Status: ${order.paymentStatus}</p>
              <p style="margin: 0; color: #8A7A6B; font-size: 13px;">Estimated Verification Time: 2-4 Hours</p>
            </div>
          </div>
          
          <div style="background-color: #2B1A12; color: #FFFFFF; text-align: center; padding: 30px 20px; font-size: 12px; opacity: 0.9;">
            <p style="margin-bottom: 10px;">MOVITEA &copy; ${new Date().getFullYear()}. All rights reserved.</p>
            <p>Need assistance? Contact our concierge at <a href="mailto:movitea8@gmail.com" style="color: #D4AF37; text-decoration: none;">movitea8@gmail.com</a></p>
          </div>
        </div>
      `
    });
    console.log('Order confirmation email sent via Resend:', data);
    return data;
  } catch (error) {
    console.error('Failed to send order confirmation email via Resend:', error);
    return null; // Do not fail the checkout process
  }
};

const sendPreOrderEmail = async (name, email, productName) => {
  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Your MOVITEA Pre-Order is Confirmed ☕',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; border: 1px solid #EAEAEA;">
          <div style="text-align: center; padding: 40px 20px;">
            <h1 style="color: #2B1A12; font-size: 26px; font-weight: 300; margin-bottom: 20px;">Pre-Order Confirmed</h1>
            <p style="color: #8A7A6B; font-size: 16px; line-height: 1.6; text-align: left; padding: 0 20px;">
              Hi ${name},<br/><br/>
              Thank you for pre-ordering <strong>${productName}</strong>.<br/><br/>
              We have received your request.<br/><br/>
              We'll notify you first when this product becomes available.<br/><br/>
              Thank you for being one of our earliest customers.<br/><br/>
              — Team MOVITEA
            </p>
          </div>
        </div>
      `
    });
    console.log('Pre-order email sent via Resend:', data);
    return data;
  } catch (error) {
    console.error('Failed to send pre-order email via Resend:', error);
    return null;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPreOrderEmail
};
