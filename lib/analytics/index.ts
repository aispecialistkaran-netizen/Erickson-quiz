import { analytics } from '@/lib/firebase/config';
import { logEvent } from 'firebase/analytics';

export type AnalyticsEvent =
  | 'assessment_view'
  | 'assessment_start'
  | 'question_view'
  | 'question_answered'
  | 'assessment_halfway'
  | 'assessment_complete'
  | 'score_teaser_view'
  | 'lead_form_view'
  | 'lead_form_submit'
  | 'lead_form_error'
  | 'full_result_view'
  | 'primary_cta_click'
  | 'advisor_cta_click'
  | 'program_cta_click'
  | 'info_session_click'
  | 'share_result'
  | 'assessment_restart';

export function trackEvent(
  eventName: AnalyticsEvent,
  eventParams?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;

  try {
    // Sanitize event parameters to prevent PII leaks
    const safeParams = { ...(eventParams || {}) };
    delete safeParams.email;
    delete safeParams.phone;
    delete safeParams.firstName;
    delete safeParams.lastName;

    console.log(`[Analytics] ${eventName}:`, safeParams);

    if (analytics) {
      logEvent(analytics, eventName, safeParams);
    }
  } catch (err) {
    console.warn(`[Analytics Warning] Failed to log event ${eventName}:`, err);
  }
}
