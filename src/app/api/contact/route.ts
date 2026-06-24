import { NextResponse } from 'next/server';
import { Client } from 'pg';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields (name, email, subject, message) are required.' },
        { status: 400 }
      );
    }

    console.log('Received contact submission:', { name, email, subject });

    // 1. Store in Database (PostgreSQL / Neon)
    let dbStatus = 'skipped';
    if (process.env.DATABASE_URL) {
      try {
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.DATABASE_URL.includes('localhost')
            ? false
            : { rejectUnauthorized: false },
        });

        await client.connect();

        // Create table if it doesn't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS portfolio_contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Insert submission record
        await client.query(
          'INSERT INTO portfolio_contacts (name, email, subject, message) VALUES ($1, $2, $3, $4)',
          [name, email, subject, message]
        );

        await client.end();
        dbStatus = 'success';
        console.log('Successfully saved to PostgreSQL database.');
      } catch (dbErr) {
        console.error('Failed to save to PostgreSQL database:', dbErr);
        dbStatus = 'failed';
      }
    } else {
      console.warn('DATABASE_URL is not set. Skipping database insertion.');
    }

    // 2. Send Email Alert using Resend
    let emailStatus = 'skipped';
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const targetEmail = process.env.CONTACT_EMAIL || 'vrajshah826@gmail.com';

        const timestamp = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'long',
          timeStyle: 'short',
        });

        const textBody = [
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'NEW PORTFOLIO CONTACT MESSAGE',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          `NAME:     ${name}`,
          `EMAIL:    ${email}`,
          `SUBJECT:  ${subject}`,
          '',
          `MESSAGE:`,
          message,
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          `Received: ${timestamp} IST`,
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        ].join('\n');

        const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Contact</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:'Courier New',monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#161b22;border:1px solid #30363d;border-radius:12px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0d1117;padding:20px 28px;border-bottom:1px solid #30363d;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#39d353;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">&#9632; SECURITY HUB</span>
                  </td>
                  <td align="right">
                    <span style="color:#484f58;font-size:11px;">portfolio contact system</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:24px 28px 16px;">
              <p style="margin:0 0 4px;color:#39d353;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Incoming transmission</p>
              <h1 style="margin:0;color:#e6edf3;font-size:20px;font-weight:700;font-family:system-ui,sans-serif;">New Contact Message</h1>
            </td>
          </tr>

          <!-- Fields -->
          <tr>
            <td style="padding:0 28px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #30363d;border-radius:8px;overflow:hidden;">

                <tr style="border-bottom:1px solid #21262d;">
                  <td style="padding:12px 16px;background:#0d1117;width:90px;">
                    <span style="color:#39d353;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">NAME</span>
                  </td>
                  <td style="padding:12px 16px;background:#161b22;border-left:1px solid #21262d;">
                    <span style="color:#e6edf3;font-size:14px;">${name}</span>
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #21262d;">
                  <td style="padding:12px 16px;background:#0d1117;">
                    <span style="color:#39d353;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">EMAIL</span>
                  </td>
                  <td style="padding:12px 16px;background:#161b22;border-left:1px solid #21262d;">
                    <a href="mailto:${email}" style="color:#58a6ff;font-size:14px;text-decoration:none;">${email}</a>
                  </td>
                </tr>

                <tr style="border-bottom:1px solid #21262d;">
                  <td style="padding:12px 16px;background:#0d1117;">
                    <span style="color:#39d353;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">SUBJECT</span>
                  </td>
                  <td style="padding:12px 16px;background:#161b22;border-left:1px solid #21262d;">
                    <span style="color:#e6edf3;font-size:14px;font-weight:600;">${subject}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding:12px 16px;background:#0d1117;vertical-align:top;">
                    <span style="color:#39d353;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">MESSAGE</span>
                  </td>
                  <td style="padding:12px 16px;background:#161b22;border-left:1px solid #21262d;">
                    <span style="color:#c9d1d9;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 28px 24px;border-top:1px solid #21262d;">
              <p style="margin:0;color:#484f58;font-size:11px;">
                Received: ${timestamp} IST &nbsp;·&nbsp; security-hub portfolio
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await resend.emails.send({
          from: 'Security Hub <onboarding@resend.dev>',
          to: targetEmail,
          subject: `[Portfolio] ${subject} — from ${name}`,
          text: textBody,
          html: htmlBody,
        });

        emailStatus = 'success';
        console.log('Successfully sent email notification via Resend.');
      } catch (emailErr) {
        console.error('Failed to send email via Resend:', emailErr);
        emailStatus = 'failed';
      }
    } else {
      console.warn('RESEND_API_KEY is not set. Skipping email dispatch.');
    }

    // Return success if at least one channel worked (or both env keys present but one failed)
    const bothMissing = !process.env.DATABASE_URL && !process.env.RESEND_API_KEY;

    if (dbStatus === 'failed' && emailStatus === 'failed') {
      return NextResponse.json(
        { error: 'Failed to save message and send email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully.',
      dbStatus,
      emailStatus,
      sandboxMode: bothMissing,
    });
  } catch (error: unknown) {
    console.error('Contact API endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred while processing message.' },
      { status: 500 }
    );
  }
}
