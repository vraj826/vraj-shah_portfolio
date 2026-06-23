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

    // 1. Store in Database (PostgreSQL / Neon / Supabase)
    let dbStatus = 'skipped';
    if (process.env.DATABASE_URL) {
      try {
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          // Support SSL for Neon & Supabase cloud databases
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
        // Default to sandbox address if not customized, sending to user email
        const targetEmail = process.env.CONTACT_EMAIL || 'vrajkumar.shah@example.com';
        
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: targetEmail,
          subject: `New Portfolio Contact: ${subject}`,
          text: `New Portfolio Contact\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
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

    // If both env keys are missing, we run in sandbox success mode for local testing
    const isMock = !process.env.DATABASE_URL && !process.env.RESEND_API_KEY;

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully.',
      dbStatus,
      emailStatus,
      sandboxMode: isMock,
    });
  } catch (error: any) {
    console.error('Contact API endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error occurred while processing message.' },
      { status: 500 }
    );
  }
}
