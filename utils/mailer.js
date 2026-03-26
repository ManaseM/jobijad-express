const nodemailer = require('nodemailer');

// Creates transporter — falls back to console log if email not configured
function getTransporter() {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
        return null; // not configured yet
    }
    return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
}

async function sendMail(to, subject, html) {
    const transporter = getTransporter();
    if (!transporter) {
        // Email not configured — just log so the server doesn't crash
        console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        await transporter.sendMail({ from: `"Jobijad Express" <${process.env.EMAIL_USER}>`, to, subject, html });
    } catch (e) {
        console.error('[EMAIL ERROR]', e.message);
    }
}

// Order confirmation to customer
async function sendOrderConfirmation(email, name, order) {
    const items = (order.items || []).map(i =>
        `<tr><td style="padding:6px 10px">${i.name}</td><td style="padding:6px 10px">x${i.quantity||1}</td><td style="padding:6px 10px;font-weight:600">$${(i.price*(i.quantity||1)).toFixed(2)}</td></tr>`
    ).join('');

    await sendMail(email, `Order Confirmed — Jobijad Express`, `
        <div style="font-family:Roboto,sans-serif;max-width:560px;margin:0 auto;color:#222">
          <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;font-size:20px;margin:0">Jobijad <span style="color:#f97316">Express</span></h1>
          </div>
          <div style="background:#fff;padding:24px;border:1px solid #e0e0e0">
            <h2 style="color:#1a1a2e">Hi ${name}, your order is confirmed!</h2>
            <p style="color:#666">Thank you for shopping with us. Here's your order summary:</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#f8f9fa;border-radius:8px">
              <thead><tr style="background:#1a1a2e;color:#fff"><th style="padding:8px 10px;text-align:left">Item</th><th style="padding:8px 10px">Qty</th><th style="padding:8px 10px">Price</th></tr></thead>
              <tbody>${items}</tbody>
            </table>
            <p style="font-size:16px;font-weight:700;color:#f97316">Total: $${(order.total||0).toFixed(2)}</p>
            <p style="color:#666;font-size:13px">Payment: ${(order.paymentMethod||'bank_transfer').replace('_',' ')}</p>
            <p style="color:#666;font-size:13px">Shipping to: ${order.shippingAddress?.city||''}, ${order.shippingAddress?.country||''}</p>
            <p style="margin-top:20px;color:#888;font-size:12px">We'll notify you when your order ships. Questions? Reply to this email.</p>
          </div>
          <div style="background:#f4f6f8;padding:12px 24px;text-align:center;font-size:11px;color:#aaa;border-radius:0 0 8px 8px">
            © 2026 Jobijad Express. All rights reserved.
          </div>
        </div>`);
}

// New order alert to admin
async function sendAdminOrderAlert(order, customerName) {
    if (!process.env.ADMIN_EMAIL) return;
    await sendMail(process.env.ADMIN_EMAIL, `New Order — ${customerName}`, `
        <div style="font-family:Roboto,sans-serif;max-width:480px;margin:0 auto;color:#222">
          <div style="background:#1a1a2e;padding:16px 20px;border-radius:8px 8px 0 0">
            <h2 style="color:#fff;margin:0;font-size:16px">🛒 New Order Received</h2>
          </div>
          <div style="background:#fff;padding:20px;border:1px solid #e0e0e0">
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Total:</strong> <span style="color:#f97316;font-weight:700">$${(order.total||0).toFixed(2)}</span></p>
            <p><strong>Items:</strong> ${(order.items||[]).length}</p>
            <p><strong>Payment:</strong> ${(order.paymentMethod||'').replace('_',' ')}</p>
            <p><strong>Ship to:</strong> ${order.shippingAddress?.city||''}, ${order.shippingAddress?.country||''}</p>
            <p style="margin-top:16px"><a href="${process.env.FRONTEND_URL||'http://localhost:3000'}/admin.html" style="background:#f97316;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">View in Admin</a></p>
          </div>
        </div>`);
}

// New signup alert to admin
async function sendAdminSignupAlert(user) {
    if (!process.env.ADMIN_EMAIL) return;
    await sendMail(process.env.ADMIN_EMAIL, `New Signup — ${user.name}`, `
        <div style="font-family:Roboto,sans-serif;max-width:480px;margin:0 auto">
          <div style="background:#1a1a2e;padding:16px 20px;border-radius:8px 8px 0 0">
            <h2 style="color:#fff;margin:0;font-size:16px">👤 New User Registered</h2>
          </div>
          <div style="background:#fff;padding:20px;border:1px solid #e0e0e0">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Joined:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>`);
}

module.exports = { sendOrderConfirmation, sendAdminOrderAlert, sendAdminSignupAlert };
