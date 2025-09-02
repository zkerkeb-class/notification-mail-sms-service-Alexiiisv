import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static instance: EmailService;
  private resend: Resend;

  private constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(emailData: EmailNotification): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const { to, subject, html, from = process.env.FROM_EMAIL || 'onboarding@resend.dev' } = emailData;

      if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      const result = await this.resend.emails.send({
        from,
        to: [to],
        subject,
        html,
      });

      // Check if the API returned an error
      if (result.error) {
        console.error('Resend API error:', result.error);
        return { 
          success: false, 
          error: result.error.message || 'Resend API error' 
        };
      }

      // Check if data is null (which indicates an error)
      if (!result.data) {
        console.error('Resend API returned null data');
        return { 
          success: false, 
          error: 'Resend API returned null data' 
        };
      }

      console.log('Email sent successfully:', result);
      return { success: true, messageId: result.data.id };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async sendNotificationEmail(
    userEmail: string, 
    notificationTitle: string, 
    notificationMessage: string,
    userName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nouvelle notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f8f9fa; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Nouvelle notification</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${userName || 'utilisateur'},</h2>
              <p>Vous avez reçu une nouvelle notification :</p>
              <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #007bff;">${notificationTitle}</h3>
                <p>${notificationMessage}</p>
              </div>
              <p>Connectez-vous à votre compte pour voir tous vos messages.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">
                  Voir mes notifications
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement. Ne répondez pas à cet email.</p>
              <p>© 2024 Votre Application. Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Nouvelle notification: ${notificationTitle}`,
      html,
    });
  }
}

export default EmailService; 