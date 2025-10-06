import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body || {};

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@yourdomain.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';

    if (!resendApiKey) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);

    const subject = `New contact form submission from ${firstName || ''} ${lastName || ''}`.trim();
    const text = `New contact submission\n\nName: ${firstName || ''} ${lastName || ''}\nEmail: ${email || ''}\nPhone: ${phone || ''}\n\nMessage:\n${message || ''}`;

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


