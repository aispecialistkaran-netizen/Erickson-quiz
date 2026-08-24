import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formData, sessionId, responseId, overallScore, readinessBand, dimensionScores, careerPath, leadTemperature, primaryMotivation, primaryBarrier, credentialInterest, timeline, utmParams } = body;

    if (!formData || !formData.email || !formData.firstName) {
      return NextResponse.json(
        { error: 'Missing required lead parameters' },
        { status: 400 }
      );
    }

    const normalizedEmail = formData.email.trim().toLowerCase();
    const now = new Date().toISOString();

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('email', '==', normalizedEmail));
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];
      const leadId = existingDoc.id;

      await updateDoc(doc(db, 'leads', leadId), {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName ? formData.lastName.trim() : '',
        phone: formData.phone ? formData.phone.trim() : '',
        role: formData.role ? formData.role.trim() : '',
        city: formData.city ? formData.city.trim() : '',
        marketingConsent: Boolean(formData.marketingConsent),
        sessionId: sessionId || '',
        responseId: responseId || '',
        overallScore: overallScore || 0,
        readinessBand: readinessBand || 'exploring_path',
        dimensionScores: dimensionScores || {},
        careerPath: careerPath || 'exploration',
        leadTemperature: leadTemperature || 'nurture',
        professionalIntentScore: dimensionScores?.professionalIntent || 0,
        primaryMotivation: primaryMotivation || '',
        primaryBarrier: primaryBarrier || '',
        credentialInterest: credentialInterest || '',
        timeline: timeline || '',
        updatedAt: now,
      });

      return NextResponse.json({ success: true, leadId, action: 'updated' });
    } else {
      const newLeadRef = doc(collection(db, 'leads'));
      const leadId = newLeadRef.id;

      const leadPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName ? formData.lastName.trim() : '',
        email: normalizedEmail,
        phone: formData.phone ? formData.phone.trim() : '',
        role: formData.role ? formData.role.trim() : '',
        city: formData.city ? formData.city.trim() : '',
        marketingConsent: Boolean(formData.marketingConsent),
        marketingConsentTimestamp: now,
        sessionId: sessionId || '',
        responseId: responseId || '',
        overallScore: overallScore || 0,
        readinessBand: readinessBand || 'exploring_path',
        dimensionScores: dimensionScores || {},
        careerPath: careerPath || 'exploration',
        leadTemperature: leadTemperature || 'nurture',
        professionalIntentScore: dimensionScores?.professionalIntent || 0,
        primaryMotivation: primaryMotivation || '',
        primaryBarrier: primaryBarrier || '',
        credentialInterest: credentialInterest || '',
        timeline: timeline || '',
        utmSource: utmParams?.utmSource || '',
        utmMedium: utmParams?.utmMedium || '',
        utmCampaign: utmParams?.utmCampaign || '',
        utmContent: utmParams?.utmContent || '',
        utmTerm: utmParams?.utmTerm || '',
        referrer: utmParams?.referrer || '',
        createdAt: now,
        updatedAt: now,
        leadStatus: 'new',
        source: 'coach-readiness-assessment',
      };

      await setDoc(newLeadRef, leadPayload);
      return NextResponse.json({ success: true, leadId, action: 'created' });
    }
  } catch (error: any) {
    console.error('Lead Submission API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
