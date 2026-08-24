const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Cloud Function Trigger: Triggers on new lead creation
 * Transmits lead payload to CRM (HubSpot / Zoho / Salesforce / Webhook)
 */
exports.onLeadCreated = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snap, context) => {
    const leadData = snap.data();
    console.log('New lead created:', context.params.leadId, leadData.email);

    // Call CRM integration helper function if CRM webhook URL is configured
    const crmWebhookUrl = process.env.CRM_WEBHOOK_URL;
    if (crmWebhookUrl) {
      try {
        await sendLeadToCRM(crmWebhookUrl, leadData);
      } catch (err) {
        console.error('CRM Webhook error:', err);
      }
    }
  });

async function sendLeadToCRM(webhookUrl, leadData) {
  const payload = {
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    email: leadData.email,
    phone: leadData.phone,
    role: leadData.role,
    city: leadData.city,
    overallScore: leadData.overallScore,
    readinessBand: leadData.readinessBand,
    leadTemperature: leadTemperature,
    careerPath: leadData.careerPath,
    timeline: leadData.timeline,
    primaryMotivation: leadData.primaryMotivation,
    primaryBarrier: leadData.primaryBarrier,
    credentialInterest: leadData.credentialInterest,
    source: leadData.source,
    utmSource: leadData.utmSource,
    utmCampaign: leadData.utmCampaign,
  };

  console.log('Sending lead payload to CRM webhook:', payload);
}
