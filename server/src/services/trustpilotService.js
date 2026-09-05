/**
 * Trustpilot Service for MinoForge
 * Connects order confirmations to Trustpilot Automatic Feedback Service (AFS)
 */

const TRUSTPILOT_AFS_EMAIL = process.env.TRUSTPILOT_AFS_EMAIL || 'minoforge.com+5420f42a0b@invite.trustpilot.com';
const TRUSTPILOT_REVIEW_URL = 'https://www.trustpilot.com/review/minoforge.com';
const TRUSTPILOT_EVALUATE_URL = 'https://www.trustpilot.com/evaluate/minoforge.com';

/**
 * Generate standard Trustpilot JSON-LD structured snippet
 * Trustpilot AFS parses this inside the email body to automatically invite buyers.
 */
function getTrustpilotJsonLd({ buyerEmail, buyerUsername, orderId }) {
  const safeName = (buyerUsername || buyerEmail.split('@')[0] || 'Valued Customer').replace(/[<>"'&]/g, '');
  const safeEmail = (buyerEmail || '').trim();
  const safeOrderId = (orderId || `MF-${Date.now()}`).toString();

  return `
    <!-- Trustpilot Automatic Feedback Service (AFS) Structured Payload -->
    <script type="application/json+trustpilot">
    {
      "recipientName": "${safeName}",
      "recipientEmail": "${safeEmail}",
      "referenceId": "${safeOrderId}"
    }
    </script>
  `;
}

/**
 * Returns Trustpilot service info
 */
function getTrustpilotConfig() {
  return {
    enabled: true,
    domain: 'minoforge.com',
    afsEmail: TRUSTPILOT_AFS_EMAIL,
    reviewUrl: TRUSTPILOT_REVIEW_URL,
    evaluateUrl: TRUSTPILOT_EVALUATE_URL,
    status: 'ACTIVE_AUTOMATIC_INVITATIONS'
  };
}

module.exports = {
  TRUSTPILOT_AFS_EMAIL,
  TRUSTPILOT_REVIEW_URL,
  TRUSTPILOT_EVALUATE_URL,
  getTrustpilotJsonLd,
  getTrustpilotConfig
};
