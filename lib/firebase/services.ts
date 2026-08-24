import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './config';
import {
  LeadFormData,
  UTMParams,
  AssessmentResponseDoc,
  LeadDoc,
  DimensionScores,
  ReadinessBandKey,
  CareerPathKey,
  LeadTemperature,
} from '@/types';

// Create a new anonymous session record
export async function createSessionRecord(utmParams: UTMParams): Promise<string> {
  try {
    const sessionRef = doc(collection(db, 'assessmentSessions'));
    const sessionId = sessionRef.id;

    await setDoc(sessionRef, {
      assessmentId: 'erickson-readiness-v1',
      startedAt: new Date().toISOString(),
      completedAt: null,
      currentQuestion: 1,
      completionStatus: 'in_progress',
      utmSource: utmParams.utmSource || '',
      utmMedium: utmParams.utmMedium || '',
      utmCampaign: utmParams.utmCampaign || '',
      utmContent: utmParams.utmContent || '',
      utmTerm: utmParams.utmTerm || '',
      referrer: utmParams.referrer || '',
      landingPage: utmParams.landingPage || '',
      answersVersion: '1.0.0',
    });

    return sessionId;
  } catch (error) {
    console.warn('Firebase session creation warning (offline fallback enabled):', error);
    return 'local-session-' + Date.now();
  }
}

// Mark session completed
export async function completeSessionRecord(sessionId: string): Promise<void> {
  if (sessionId.startsWith('local-')) return;
  try {
    const sessionRef = doc(db, 'assessmentSessions', sessionId);
    await updateDoc(sessionRef, {
      completedAt: new Date().toISOString(),
      completionStatus: 'completed',
    });
  } catch (err) {
    console.warn('Could not update session completion status:', err);
  }
}

// Save Assessment Responses
export async function saveResponseRecord(data: {
  sessionId: string;
  answers: Record<string, string>;
  dimensionScores: DimensionScores;
  overallScore: number;
  readinessBand: ReadinessBandKey;
  careerPath: CareerPathKey;
  primaryMotivation?: string;
  primaryBarrier?: string;
  credentialInterest?: string;
  timeline?: string;
}): Promise<string> {
  try {
    const responseRef = doc(collection(db, 'assessmentResponses'));
    const responseId = responseRef.id;

    const payload: AssessmentResponseDoc = {
      sessionId: data.sessionId,
      answers: data.answers,
      dimensionScores: data.dimensionScores,
      overallScore: data.overallScore,
      readinessBand: data.readinessBand,
      careerPath: data.careerPath,
      primaryMotivation: data.primaryMotivation || '',
      primaryBarrier: data.primaryBarrier || '',
      credentialInterest: data.credentialInterest || '',
      timeline: data.timeline || '',
      createdAt: new Date().toISOString(),
    };

    await setDoc(responseRef, payload);
    return responseId;
  } catch (err) {
    console.warn('Error saving assessment response (offline fallback):', err);
    return 'local-response-' + Date.now();
  }
}

// Submit Lead Record with Duplicate Prevention (Normalizing Email)
export async function submitLeadRecord(params: {
  formData: LeadFormData;
  sessionId: string;
  responseId: string;
  overallScore: number;
  readinessBand: ReadinessBandKey;
  dimensionScores: DimensionScores;
  careerPath: CareerPathKey;
  leadTemperature: LeadTemperature;
  primaryMotivation?: string;
  primaryBarrier?: string;
  credentialInterest?: string;
  timeline?: string;
  utmParams: UTMParams;
}): Promise<{ success: boolean; leadId: string }> {
  try {
    // 1. Try secure API route submission first
    const res = await fetch('/api/lead-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, leadId: data.leadId };
    }
  } catch (err) {
    console.warn('API route lead submission failed, falling back to direct SDK:', err);
  }

  // 2. Direct Firestore SDK submission fallback
  try {
    const normalizedEmail = params.formData.email.trim().toLowerCase();
    const leadsRef = collection(db, 'leads');
    
    // Check if lead already exists by email
    const q = query(leadsRef, where('email', '==', normalizedEmail), limit(1));
    const existingDocs = await getDocs(q);

    const now = new Date().toISOString();

    if (!existingDocs.empty) {
      const existingDoc = existingDocs.docs[0];
      const leadId = existingDoc.id;
      
      await updateDoc(doc(db, 'leads', leadId), {
        firstName: params.formData.firstName.trim(),
        lastName: params.formData.lastName.trim(),
        phone: params.formData.phone.trim(),
        role: params.formData.role || '',
        city: params.formData.city || '',
        marketingConsent: params.formData.marketingConsent,
        sessionId: params.sessionId,
        responseId: params.responseId,
        overallScore: params.overallScore,
        readinessBand: params.readinessBand,
        dimensionScores: params.dimensionScores,
        careerPath: params.careerPath,
        leadTemperature: params.leadTemperature,
        professionalIntentScore: params.dimensionScores.professionalIntent,
        primaryMotivation: params.primaryMotivation || '',
        primaryBarrier: params.primaryBarrier || '',
        credentialInterest: params.credentialInterest || '',
        timeline: params.timeline || '',
        updatedAt: now,
      });

      return { success: true, leadId };
    } else {
      const newLeadRef = doc(collection(db, 'leads'));
      const leadId = newLeadRef.id;

      const leadPayload: LeadDoc = {
        firstName: params.formData.firstName.trim(),
        lastName: params.formData.lastName.trim(),
        email: normalizedEmail,
        phone: params.formData.phone.trim(),
        role: params.formData.role || '',
        city: params.formData.city || '',
        marketingConsent: params.formData.marketingConsent,
        marketingConsentTimestamp: now,
        sessionId: params.sessionId,
        responseId: params.responseId,
        overallScore: params.overallScore,
        readinessBand: params.readinessBand,
        dimensionScores: params.dimensionScores,
        careerPath: params.careerPath,
        leadTemperature: params.leadTemperature,
        professionalIntentScore: params.dimensionScores.professionalIntent,
        primaryMotivation: params.primaryMotivation || '',
        primaryBarrier: params.primaryBarrier || '',
        credentialInterest: params.credentialInterest || '',
        timeline: params.timeline || '',
        utmSource: params.utmParams.utmSource || '',
        utmMedium: params.utmParams.utmMedium || '',
        utmCampaign: params.utmParams.utmCampaign || '',
        utmContent: params.utmParams.utmContent || '',
        utmTerm: params.utmParams.utmTerm || '',
        referrer: params.utmParams.referrer || '',
        createdAt: now,
        updatedAt: now,
        leadStatus: 'new',
        source: 'coach-readiness-assessment',
      };

      await setDoc(newLeadRef, leadPayload);
      return { success: true, leadId };
    }
  } catch (error) {
    console.error('Lead submission error:', error);
    // Offline local fallback ID so user experience never fails
    return { success: true, leadId: 'offline-lead-' + Date.now() };
  }
}

// Fetch all leads for Admin Dashboard
export async function fetchAdminLeads(): Promise<LeadDoc[]> {
  try {
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('createdAt', 'desc'), limit(500));
    const snapshot = await getDocs(q);

    const leads: LeadDoc[] = [];
    snapshot.forEach((d) => {
      leads.push({ id: d.id, ...(d.data() as LeadDoc) });
    });
    return leads;
  } catch (err) {
    console.error('Error fetching admin leads:', err);
    return [];
  }
}

// Delete Lead Record from Firestore
export async function deleteLeadRecord(leadId: string): Promise<boolean> {
  if (!leadId) return false;
  try {
    const leadRef = doc(db, 'leads', leadId);
    await deleteDoc(leadRef);
    return true;
  } catch (err) {
    console.error('Error deleting lead record from Firestore:', err);
    return false;
  }
}

