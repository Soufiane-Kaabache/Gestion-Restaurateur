import nodemailer from 'nodemailer';
import { NotificationType } from '@/mailer/notification-types';
import { NOTIFICATION_RULES, getStaffEmails } from '@/mailer/notification-config';

// Transporteur Mailtrap
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Fonction générique d'envoi
export async function sendMail({
  to,
  bcc,
  subject,
  text,
  html,
}: {
  to?: string;
  bcc?: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const fromAddress = `${process.env.MAIL_FROM_NAME || 'Restaurant System'} <${process.env.MAIL_FROM_ADDRESS || 'noreply@restaurant.local'}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: to || undefined,
      bcc: bcc || undefined,
      subject,
      text,
      html: html || text,
    });

    console.log('✅ Email envoyé (Mailtrap):', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    return { success: false, error };
  }
}

// Template confirmation réservation
export async function sendReservationConfirmation(data: {
  customerName: string;
  customerEmail: string;
  date: Date;
  partySize: number;
  specialRequests?: string;
}) {
  const formattedDate = data.date.toLocaleString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return sendMail({
    to: data.customerEmail,
    subject: `Confirmation de réservation - ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background-color: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4F46E5; }
          ul { list-style: none; padding: 0; }
          li { padding: 8px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Réservation Confirmée</h1>
          </div>
          <div class="content">
            <p>Bonjour <strong>${data.customerName}</strong>,</p>
            <p>Votre réservation a été enregistrée avec succès !</p>
            
            <div class="info-box">
              <ul>
                <li><strong>📅 Date :</strong> ${formattedDate}</li>
                <li><strong>👥 Nombre de personnes :</strong> ${data.partySize}</li>
                ${data.specialRequests ? `<li><strong>📝 Demandes spéciales :</strong> ${data.specialRequests}</li>` : ''}
              </ul>
            </div>
            
            <p>Nous avons hâte de vous accueillir !</p>
            <p>En cas de modification ou annulation, veuillez nous contacter.</p>
            
            <div class="footer">
              <p>© 2024 Restaurant System - Cet email a été envoyé automatiquement</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Bonjour ${data.customerName},

Votre réservation est confirmée !

📅 Date : ${formattedDate}
👥 Nombre de personnes : ${data.partySize}
${data.specialRequests ? `📝 Demandes spéciales : ${data.specialRequests}` : ''}

Nous avons hâte de vous accueillir !

Cordialement,
L'équipe du Restaurant
    `,
  });
}

// -------------------------
// Staff notification helpers
// -------------------------

/**
 * Envoie une notification au personnel concerné en BCC
 */
export async function notifyStaff(
  type: NotificationType,
  data: {
    subject: string;
    htmlContent: string;
    textContent: string;
  },
) {
  const staffEmails = getStaffEmails();
  const config = NOTIFICATION_RULES[type];

  if (!config) {
    console.warn(`⚠️ Type de notification inconnu: ${type}`);
    return;
  }

  const recipients = config.recipients
    .map((role) => staffEmails[role as keyof typeof staffEmails])
    .filter((email) => !!email);

  if (recipients.length === 0) {
    console.warn(`⚠️ Aucun destinataire configuré pour: ${type}`);
    return;
  }

  // Envoi en BCC pour confidentialité
  await sendMail({
    bcc: recipients.join(','),
    subject: data.subject,
    html: data.htmlContent,
    text: data.textContent,
  });

  console.log(`✅ Notification envoyée (${type}): ${recipients.length} destinataire(s)`);
}

export async function notifyNewReservation(reservationData: {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  date: Date;
  partySize: number;
}) {
  const formattedDate = reservationData.date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  await notifyStaff(NotificationType.NEW_RESERVATION, {
    subject: `🆕 Nouvelle réservation - ${reservationData.customerName}`,
    htmlContent: `
      <h2>Nouvelle réservation reçue</h2>
      <p><strong>Client:</strong> ${reservationData.customerName}</p>
      <p><strong>Email:</strong> ${reservationData.customerEmail || '—'}</p>
      <p><strong>Téléphone:</strong> ${reservationData.customerPhone || '—'}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Nombre de personnes:</strong> ${reservationData.partySize}</p>
      <hr>
      <p><em>Connectez-vous à la plateforme pour gérer cette réservation.</em></p>
    `,
    textContent: `
Nouvelle réservation reçue

Client: ${reservationData.customerName}
Email: ${reservationData.customerEmail || '—'}
Téléphone: ${reservationData.customerPhone || '—'}
Date: ${formattedDate}
Nombre de personnes: ${reservationData.partySize}

Connectez-vous à la plateforme pour gérer cette réservation.
    `,
  });
}

export async function notifyNewOrder(orderData: {
  orderNumber: string;
  tableNumber: number;
  items: Array<{ name: string; quantity: number }>;
}) {
  const itemsList = orderData.items.map((item) => `- ${item.quantity}x ${item.name}`).join('\n');

  await notifyStaff(NotificationType.NEW_ORDER, {
    subject: `🍽️ Nouvelle commande - Table ${orderData.tableNumber}`,
    htmlContent: `
      <h2>Nouvelle commande à préparer</h2>
      <p><strong>N° commande:</strong> ${orderData.orderNumber}</p>
      <p><strong>Table:</strong> ${orderData.tableNumber}</p>
      <h3>Articles:</h3>
      <ul>
        ${orderData.items.map((item) => `<li>${item.quantity}x ${item.name}</li>`).join('')}
      </ul>
    `,
    textContent: `
Nouvelle commande à préparer

N° commande: ${orderData.orderNumber}
Table: ${orderData.tableNumber}

Articles:
${itemsList}
    `,
  });
}

export async function notifyDrinksOrder(orderData: {
  orderNumber: string;
  tableNumber: number;
  drinks: Array<{ name: string; quantity: number }>;
}) {
  const drinksList = orderData.drinks.map((d) => `- ${d.quantity}x ${d.name}`).join('\n');

  await notifyStaff(NotificationType.DRINKS_ORDER, {
    subject: `🍹 Commande boissons - Table ${orderData.tableNumber}`,
    htmlContent: `
      <h2>Commande de boissons</h2>
      <p><strong>N° commande:</strong> ${orderData.orderNumber}</p>
      <p><strong>Table:</strong> ${orderData.tableNumber}</p>
      <h3>Boissons:</h3>
      <ul>
        ${orderData.drinks.map((d) => `<li>${d.quantity}x ${d.name}</li>`).join('')}
      </ul>
    `,
    textContent: `
Commande de boissons

N° commande: ${orderData.orderNumber}
Table: ${orderData.tableNumber}

Boissons:
${drinksList}
    `,
  });
}
