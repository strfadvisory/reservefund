import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.MAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.MAIL_PORT || '587', 10);
  const encryption = (process.env.MAIL_ENCRYPTION || 'tls').toLowerCase();
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: encryption === 'ssl' || port === 465,
    auth: {
      user: process.env.MAIL_USERNAME || process.env.EMAIL_USER,
      pass: process.env.MAIL_PASSWORD || process.env.EMAIL_PASS,
    },
  });
  return transporter;
}

export async function sendInviteEmail(
  to: string,
  opts: { firstName: string; inviterName: string; roleLabel: string; link: string }
) {
  const from = `"${process.env.MAIL_FROM_NAME || 'Reserve Fund Advisors'}" <${
    process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_USER
  }>`;
  const subject = `You've been invited as ${opts.roleLabel}`;
  const text = `${opts.inviterName} invited you to Reserve Fund as ${opts.roleLabel}. Accept: ${opts.link}`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#102C4A;padding:24px;">
      <h2 style="color:#0E519B;margin:0 0 12px;">Hi ${opts.firstName},</h2>
      <p style="font-size:16px;line-height:1.5;">${opts.inviterName} has invited you to Reserve Fund Advisors as <strong>${opts.roleLabel}</strong>.</p>
      <p style="font-size:16px;line-height:1.5;">Click the button below to set your password and activate your account.</p>
      <p><a href="${opts.link}" style="display:inline-block;background:#0E519B;color:#fff;text-decoration:none;padding:12px 24px;border-radius:7px;font-weight:600;">Accept Invitation</a></p>
      <p style="font-size:14px;color:#66717D;">Or copy this link into your browser:<br/>${opts.link}</p>
    </div>
  `;
  await getTransporter().sendMail({ from, to, subject, text, html });
}

export async function sendOtpEmail(to: string, otp: string) {
  const from = `"${process.env.MAIL_FROM_NAME || 'Reserve Fund Advisors'}" <${
    process.env.MAIL_FROM_ADDRESS || process.env.EMAIL_USER
  }>`;
  const subject = 'Your verification code';
  const text = `Your verification code is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family:Arial,sans-serif;color:#102C4A;padding:24px;">
      <h2 style="color:#0E519B;margin:0 0 12px;">Verify your email</h2>
      <p style="font-size:16px;line-height:1.5;">Use the code below to complete your registration. It expires in 10 minutes.</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:6px;padding:16px 24px;background:#F4F6F9;border-radius:7px;display:inline-block;margin:12px 0;">${otp}</div>
      <p style="font-size:14px;color:#66717D;">If you didn't request this, you can ignore this email.</p>
    </div>
  `;
  await getTransporter().sendMail({ from, to, subject, text, html });
}
