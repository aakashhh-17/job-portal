import {Resend} from 'resend';
import dotenv from 'dotenv'
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const STATUS_STYLES = {
  Accepted: { color: '#16a34a', bg: '#f0fdf4', label: 'Accepted 🎉' },
  Rejected: { color: '#dc2626', bg: '#fef2f2', label: 'Rejected' },
  Pending:  { color: '#2563eb', bg: '#eff6ff', label: 'Under Review' },
};

export const sendStatusChangeEmail = async ({ toEmail, userName, jobTitle, companyName, newStatus }) => {
  const style = STATUS_STYLES[newStatus] || STATUS_STYLES.Pending;

  const { data, error } = await resend.emails.send({
    from: 'CareerBridge <onboarding@resend.dev>',
    to: toEmail,
    subject: `Application Update: ${jobTitle} at ${companyName}`,
    html: `
      <div style="font-family: 'Outfit', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #ffffff;">
        
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 4px;">
          <span style="font-weight: 800;">Career</span>Bridge
        </h1>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0 24px;" />

        <p style="font-size: 16px; color: #374151;">Hi ${userName},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been reviewed.
        </p>

        <div style="margin: 24px 0; padding: 16px 20px; background: ${style.bg}; border-left: 4px solid ${style.color}; border-radius: 4px;">
          <p style="margin: 0; font-size: 15px; color: #111827;">
            Status: <strong style="color: ${style.color};">${style.label}</strong>
          </p>
        </div>

        ${newStatus === 'Accepted'
          ? `<p style="font-size: 15px; color: #374151; line-height: 1.6;">
              Congratulations! The company will be in touch with you shortly regarding next steps.
             </p>`
          : newStatus === 'Rejected'
          ? `<p style="font-size: 15px; color: #374151; line-height: 1.6;">
              Don't be discouraged — there are many more opportunities waiting for you on CareerBridge.
             </p>`
          : ''
        }

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0 16px;" />
        <p style="font-size: 12px; color: #9ca3af;">
          You're receiving this because you applied for a job on CareerBridge.
        </p>
      </div>
    `,
  });

  if (error) throw new Error(error.message);
  return data;
};