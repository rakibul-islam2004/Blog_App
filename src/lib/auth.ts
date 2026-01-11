import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationURL = `${process.env.APP_URL}/verify-email/?token=${token}`;

        const info = await transporter.sendMail({
          from: '"Prisma Blog" <plrismablog@ethereal.email>',
          to: user.email,
          subject: "Please verify your email!",
          html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f1f3f5;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, Helvetica, Arial, sans-serif;
      }

      .wrapper {
        width: 100%;
        padding: 40px 0;
      }

      .card {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      }

      .header {
        padding: 24px 32px;
        border-bottom: 1px solid #e5e7eb;
        text-align: center;
      }

      .header h2 {
        margin: 0;
        font-size: 22px;
        color: #111827;
      }

      .content {
        padding: 32px;
        color: #374151;
        font-size: 15px;
        line-height: 1.7;
      }

      .content p {
        margin: 0 0 16px;
      }

      .cta-wrapper {
        text-align: center;
        margin: 32px 0;
      }

      .cta-button {
        display: inline-block;
        padding: 14px 32px;
        background-color: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        font-size: 15px;
        font-weight: 600;
        border-radius: 6px;
      }

      .divider {
        height: 1px;
        background-color: #e5e7eb;
        margin: 24px 0;
      }

      .link {
        font-size: 13px;
        color: #2563eb;
        word-break: break-all;
      }

      .footer {
        padding: 20px 32px;
        background-color: #f9fafb;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="card">
        <div class="header">
          <h2>Confirm your email address</h2>
        </div>

        <div class="content">
          <p>Hello, ${user.name}</p>

          <p>
            Thank you for creating an account with
            <strong>Prisma Blog</strong>.
          </p>

          <p>
            To complete your registration, please confirm your email address by
            clicking the button below:
          </p>

          <div class="cta-wrapper">
            <a href="${verificationURL}" class="cta-button">
              Verify Email Address
            </a>
          </div>

          <p>
            This verification link will expire in <strong>24 hours</strong>.
          </p>

          <div class="divider"></div>

          <p style="font-size: 13px">
            If the button above does not work, copy and paste the following link
            into your browser:
          </p>

          <p class="link">${verificationURL}</p>

          <p style="font-size: 13px">
            If you did not create this account, no further action is required.
          </p>

          <p>Regards,<br />Prisma Blog Team</p>
        </div>

        <div class="footer">
          © 2026 Prisma Blog · All rights reserved
        </div>
      </div>
    </div>
  </body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
