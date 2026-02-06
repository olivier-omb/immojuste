import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("Warning: RESEND_API_KEY is not set. Email service will not work.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM_EMAIL = process.env.FROM_EMAIL || "ImmoJuste <noreply@immojuste.be>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000";

export interface EmailTemplateProps {
  recipientName: string;
  recipientEmail: string;
}

// Template: OTP verification code
export async function sendOtpEmail({
  recipientEmail,
  code,
}: {
  recipientEmail: string;
  code: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0066FF; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ImmoJuste</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Votre code de vérification</h2>
          <p style="color: #666666; line-height: 1.6;">Utilisez le code ci-dessous pour vous connecter à ImmoJuste.</p>
          <div style="background-color: #f5f5f5; padding: 24px; border-radius: 12px; margin: 24px 0;">
            <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0066FF; margin: 0;">${code}</p>
          </div>
          <p style="color: #999999; font-size: 14px;">Ce code expire dans <strong>10 minutes</strong>.</p>
          <p style="color: #999999; font-size: 14px;">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">ImmoJuste — Plateforme technologique de matching immobilier</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `${code} — Votre code ImmoJuste`,
      html,
    });

    if (error) {
      console.error("Failed to send OTP email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error };
  }
}

// Template: Welcome email after registration
export async function sendWelcomeEmail({
  recipientName,
  recipientEmail,
  role,
}: EmailTemplateProps & { role: string }) {
  const roleMessages = {
    BUYER: {
      subject: "Bienvenue sur ImmoJuste - Trouvez votre bien idéal",
      intro: "Vous êtes maintenant inscrit en tant qu'acheteur sur ImmoJuste.",
      cta: "Voir mon tableau de bord",
      ctaUrl: `${APP_URL}/dashboard/buyer`,
      nextSteps: [
        "Votre profil acheteur a été créé avec vos critères",
        "Notre algorithme recherche les biens compatibles",
        "Des vendeurs pourront activer un espace d'échange privé avec vous",
        "Vous serez notifié dès qu'un vendeur s'intéresse à votre profil !",
      ],
    },
    SELLER: {
      subject: "Bienvenue sur ImmoJuste - Vendez sans commission",
      intro: "Vous êtes maintenant inscrit en tant que vendeur sur ImmoJuste.",
      cta: "Voir mon tableau de bord",
      ctaUrl: `${APP_URL}/dashboard/seller`,
      nextSteps: [
        "Votre bien a été enregistré avec ses caractéristiques",
        "Découvrez les acheteurs compatibles",
        "Activez un espace d'échange privé pour contacter un acheteur (79€)",
        "Vendez directement, sans commission !",
      ],
    },
    AGENT: {
      subject: "Bienvenue sur ImmoJuste - Développez votre activité",
      intro: "Vous êtes maintenant inscrit en tant qu'agent sur ImmoJuste.",
      cta: "Choisir mon abonnement",
      ctaUrl: `${APP_URL}/agent`,
      nextSteps: [
        "Choisissez un abonnement adapté à vos besoins",
        "Définissez vos zones de couverture",
        "Accédez aux leads qualifiés",
        "Développez votre portefeuille clients !",
      ],
    },
  };

  const template = roleMessages[role as keyof typeof roleMessages] || roleMessages.BUYER;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0066FF; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ImmoJuste</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Bonjour ${recipientName} !</h2>
          <p style="color: #666666; line-height: 1.6;">${template.intro}</p>
          <p style="color: #666666; line-height: 1.6;">Voici les prochaines étapes pour bien démarrer :</p>
          <ul style="color: #666666; line-height: 1.8;">
            ${template.nextSteps.map((step) => `<li>${step}</li>`).join("")}
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${template.ctaUrl}" style="display: inline-block; background-color: #0066FF; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">${template.cta}</a>
          </div>
          <p style="color: #666666; line-height: 1.6;">Des questions ? Répondez simplement à cet email, notre équipe se fera un plaisir de vous aider.</p>
          <p style="color: #666666; margin-bottom: 0;">À bientôt,<br>L'équipe ImmoJuste</p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">ImmoJuste — Plateforme technologique de matching immobilier</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: template.subject,
      html,
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

// Template: New match notification for buyer
export async function sendNewMatchEmail({
  recipientName,
  recipientEmail,
  propertyCommune,
  propertyType,
  matchScore,
}: EmailTemplateProps & {
  propertyCommune: string;
  propertyType: string;
  matchScore: number;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0066FF; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Nouveau match !</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Bonjour ${recipientName} !</h2>
          <p style="color: #666666; line-height: 1.6;">Bonne nouvelle ! Un nouveau bien correspond à vos critères.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Type :</strong> ${propertyType}</p>
            <p style="margin: 0 0 10px 0;"><strong>Localisation :</strong> ${propertyCommune}</p>
            <p style="margin: 0;"><strong>Compatibilité :</strong> <span style="color: #00CC66; font-weight: bold;">${matchScore}%</span></p>
          </div>
          <p style="color: #666666; line-height: 1.6;">Le vendeur pourrait vous contacter prochainement s'il est intéressé par votre profil.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard/buyer" style="display: inline-block; background-color: #0066FF; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Voir mes matches</a>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">ImmoJuste — Plateforme technologique de matching immobilier</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Nouveau match à ${propertyCommune} - ${matchScore}% compatible`,
      html,
    });

    if (error) {
      console.error("Failed to send match email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending match email:", error);
    return { success: false, error };
  }
}

// Template: Space activated notification for buyer
export async function sendContactUnlockedEmail({
  recipientName,
  recipientEmail,
  propertyCommune,
  sellerName,
}: EmailTemplateProps & {
  propertyCommune: string;
  sellerName: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #00CC66; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Un espace d'échange a été activé !</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Félicitations ${recipientName} !</h2>
          <p style="color: #666666; line-height: 1.6;"><strong>${sellerName}</strong> a activé un espace d'échange privé pour son bien à <strong>${propertyCommune}</strong>.</p>
          <p style="color: #666666; line-height: 1.6;">Cela signifie qu'il est intéressé par votre profil d'acheteur et souhaite échanger avec vous.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #666666;"><strong>Conseil :</strong> Assurez-vous que votre profil est complet et à jour pour maximiser vos chances de concrétiser cette opportunité.</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard/buyer" style="display: inline-block; background-color: #0066FF; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Voir mon tableau de bord</a>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">ImmoJuste — Plateforme technologique de matching immobilier</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Espace d'échange activé — Bien à ${propertyCommune}`,
      html,
    });

    if (error) {
      console.error("Failed to send unlock email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending unlock email:", error);
    return { success: false, error };
  }
}

// Template: Payment confirmation
export async function sendPaymentConfirmationEmail({
  recipientName,
  recipientEmail,
  amount,
}: EmailTemplateProps & {
  amount: number;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0066FF; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Paiement confirmé</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Merci ${recipientName} !</h2>
          <p style="color: #666666; line-height: 1.6;">Votre paiement a été confirmé avec succès.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Service :</strong> Activation d'espace d'échange privé</p>
            <p style="margin: 0;"><strong>Montant :</strong> ${amount} € TTC</p>
          </div>
          <p style="color: #666666; line-height: 1.6;">L'espace d'échange privé est maintenant activé. Vous pouvez consulter le profil complet de l'acheteur.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}/dashboard/seller/matches" style="display: inline-block; background-color: #0066FF; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Voir les acheteurs</a>
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">ImmoJuste — Plateforme technologique de matching immobilier</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Paiement confirmé — Activation espace d'échange (${amount}€)`,
      html,
    });

    if (error) {
      console.error("Failed to send payment email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending payment email:", error);
    return { success: false, error };
  }
}
