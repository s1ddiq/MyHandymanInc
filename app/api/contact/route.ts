import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  //   SET TO 3 (may reduce bnow set to 5!)
  limiter: Ratelimit.slidingWindow(5, "24h"), // 2026 4/14/ @ 4:58pm
});

// Email template function - Handcrafted, warm, human-centered design
function generateEmailTemplate(formData: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const serviceLabel = formData.service
    ? formData.service
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    : "Not specified";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Message - My Handyman Inc</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      background-color: #f5f3ef;
      margin: 0;
      padding: 20px;
    }
    .email-container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: #1e3a5f;
      padding: 32px 24px;
      text-align: center;
      border-bottom: 4px solid #0059bf;
    }
    .header h1 {
      color: white;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -0.3px;
      margin-bottom: 8px;
    }
    .header p {
      color: rgba(255,255,255,0.85);
      font-size: 14px;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1e3a5f;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0ede8;
    }
    .detail-row {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
    }
    .detail-label {
      width: 100px;
      font-weight: 600;
      color: #1e3a5f;
      font-size: 14px;
    }
    .detail-value {
      flex: 1;
      color: #2d3748;
      font-size: 15px;
    }
    .service-badge {
      display: inline-block;
      background-color: #0059bf;
      color: white;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 500;
    }
    .message-box {
      background-color: #f9f7f4;
      padding: 18px;
      
      margin-top: 8px;
      border: 3px solid #0059bf;
      color: #2d3748;
      font-size: 14px;
      line-height: 1.6;
    }
    .contact-info {
      background-color: #f0f4f8;
      padding: 16px 20px;
      
      margin-top: 24px;
      text-align: center;
    }
    .contact-info p {
      color: #1e3a5f;
      font-size: 13px;
      margin: 4px 0;
    }
    .contact-info a {
      color: #0059bf;
      text-decoration: none;
      font-weight: 500;
    }
    .footer {
      background-color: #f9f7f4;
      padding: 20px 28px;
      text-align: center;
      font-size: 12px;
      color: #8b7f6e;
      border-top: 1px solid #e8e4df;
    }
    .footer a {
      color: #0059bf;
      text-decoration: none;
    }
    @media (max-width: 480px) {
      .detail-row {
        flex-direction: column;
      }
      .detail-label {
        width: 100%;
        margin-bottom: 6px;
      }
      .content {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🔨 New Message From Website</h1>
      <p>My Handyman Inc | Orange & Woodbridge, CT</p>
      <p>Developed by s1ddiq :)</p> i WAS HJERE 2026 WOHOOO!
    </div>
    <div class="content">
      <div class="greeting">
        📬 New inquiry from ${formData.name}
      </div>
      
      <div class="detail-row">
        <div class="detail-label">Name</div>
        <div class="detail-value">${formData.name}</div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">Email</div>
        <div class="detail-value">
          <a href="mailto:${formData.email}" style="color: #0059bf; text-decoration: none;">${formData.email}</a>
        </div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">Phone</div>
        <div class="detail-value">
          <a href="tel:${formData.phone}" style="color: #0059bf; text-decoration: none;">${formData.phone}</a>
        </div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">Service</div>
        <div class="detail-value">
          <span class="service-badge">${serviceLabel}</span>
        </div>
      </div>
      
      <div class="detail-row">
        <div class="detail-label">Message</div>
        <div class="detail-value">
          <div class="message-box">
            ${formData.message.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>
      
      <div class="contact-info">
        <p>📞 Call back: <a href="tel:${formData.phone}">${formData.phone}</a></p>
        <p>✉️ Email: <a href="mailto:${formData.email}">${formData.email}</a></p>
        <p style="margin-top: 8px; font-size: 11px;">Submitted on ${new Date().toLocaleString()}</p>
      </div>
    </div>
    <div class="footer">
      <p>My Handyman Inc | Serving Orange & Woodbridge, CT Since 2012</p>
      <p style="margin-top: 6px;">
        <a href="tel:+12034413471">(203) 441-3471</a> | 
        <a href="mailto:myhandymaninc1@gmail.com">myhandymaninc1@gmail.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Auto-reply template - Warm, human, not robotic
function generateAutoReplyTemplate(name: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for reaching out - My Handyman Inc</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      background-color: #f5f3ef;
      margin: 0;
      padding: 20px;
    }
    .email-container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: #0059bf;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: white;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .header p {
      color: rgba(255,255,255,0.85);
      font-size: 14px;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #1e3a5f;
      margin-bottom: 16px;
    }
    .message-body {
      color: #2d3748;
      font-size: 15px;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    .next-steps {
      background-color: #f9f7f4;
      padding: 20px;
      
      margin: 20px 0;
    }
    .next-steps h3 {
      color: #1e3a5f;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .next-steps ul {
      margin-left: 20px;
      color: #2d3748;
      font-size: 14px;
    }
    .next-steps li {
      margin: 8px 0;
    }
    .button {
      display: inline-block;
      background-color: #0059bf;
      color: white;
      padding: 12px 28px;
      
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      margin: 16px 0 8px;
    }
    .signature {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #e8e4df;
      color: #5a4e3e;
      font-size: 14px;
    }
    .footer {
      background-color: #f9f7f4;
      padding: 20px 28px;
      text-align: center;
      font-size: 12px;
      color: #8b7f6e;
      border-top: 1px solid #e8e4df;
    }
    .footer a {
      color: #0059bf;
      text-decoration: none;
    }
    @media (max-width: 480px) {
      .content {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Thanks for reaching out, ${name}!</h1>
      <p>We've got your message</p>
    </div>
    <div class="content">
      <div class="greeting">
        👋 Hey ${name},
      </div>
      
      <div class="message-body">
        Thanks for contacting My Handyman Inc. We know home projects can be stressful — whether it's a leaky faucet, a broken appliance, or that deck you've been meaning to fix. We're here to help make it easy.
      </div>
      
      <div class="next-steps">
        <h3>📋 Here's what happens next:</h3>
        <ul>
          <li>✅ Someone from our team will review your request</li>
          <li>📞 We'll call or text you within 24 hours</li>
          <li>💰 We'll give you an upfront estimate</li>
          <li>🔧 Schedule a time that works for you</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="tel:+12034413471" class="button" style="color: white;">📞 Need us faster? Call (203) 441-3471</a>
        <p style="font-size: 13px; color: #8b7f6e; margin-top: 12px;">Or reply to this email anytime</p>
      </div>
      
      <div class="signature">
        <p>Talk soon,<br>
        <strong>Siddiq & The My Handyman Team</strong></p>
        <p style="font-size: 13px; margin-top: 8px;">P.S. — We're real people, not robots. If you need anything urgent, just call or text. We pick up.</p>
      </div>
    </div>
    <div class="footer">
      <p>My Handyman Inc | Orange & Woodbridge, CT</p>
      <p style="margin-top: 6px;">
        <a href="tel:+12034413471">(203) 441-3471</a> | 
        <a href="mailto:myhandymaninc1@gmail.com">myhandymaninc1@gmail.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Please try again tomorrow." },
        { status: 429 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const toEmail = process.env.CONTACT_EMAIL_TO;
    const fromEmail = process.env.CONTACT_EMAIL_FROM;

    if (!toEmail || !fromEmail) {
      console.error("Missing email environment variables");
      return NextResponse.json(
        { message: "Email configuration error. Please contact support." },
        { status: 500 },
      );
    }

    // Send to business owner
    const { data: ownerEmailData, error: ownerError } =
      await resend.emails.send({
        from: `My Handyman Inc <${fromEmail}>`,
        to: [toEmail],
        subject: `🔨 New Message: ${name} - ${service || "General Inquiry"}`,
        replyTo: email,
        html: generateEmailTemplate({ name, email, phone, service, message }),
      });

    if (ownerError) {
      console.error("Error sending owner email:", ownerError);
      return NextResponse.json(
        { message: "Failed to send. Please call us directly." },
        { status: 500 },
      );
    }

    // Send auto-reply to customer
    try {
      await resend.emails.send({
        from: `Siddiq @ My Handyman Inc <${fromEmail}>`,
        to: [email],
        subject: `Thanks ${name}! We'll be in touch soon`,
        html: generateAutoReplyTemplate(name),
      });
    } catch (autoReplyError) {
      console.error("Auto-reply failed (non-critical):", autoReplyError);
    }

    return NextResponse.json(
      {
        message: "Message sent! We'll get back to you within 24 hours.",
        id: ownerEmailData?.id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please call us directly." },
      { status: 500 },
    );
  }
}
