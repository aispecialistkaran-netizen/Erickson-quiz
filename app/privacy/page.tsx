import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#071E2A] text-white p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-8 glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <BrandLogo size="md" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#FFD978] hover:text-white font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F9D73]/20 text-[#1F9D73] border border-[#1F9D73]/40 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Data Protection &amp; Privacy Policy
          </div>
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-[#64757D]">Last updated: July 2026</p>
        </div>

        <div className="space-y-6 text-sm text-white/85 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you participate in the Professional Coaching Readiness Assessment, we collect your assessment responses, dimension scores, and contact information (First Name, Last Name, Email Address, Phone Number, Current Role, City) provided upon completing the readiness evaluation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. How We Use Your Data</h2>
            <p>
              We use your data strictly to generate your personalized Coaching Readiness Profile, evaluate your suitability for ICF-accredited coach education, provide tailored career path guidance, and allow Erickson Coaching International India advisors to connect with you regarding training cohorts and resources.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Marketing Consent</h2>
            <p>
              By opting into marketing communications, you consent to receiving information about Erickson Coaching International India&apos;s accredited programmes, information sessions, and educational materials. You can opt out at any time via the unsubscribe link in any email.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Data Security</h2>
            <p>
              Your personal data is encrypted in transit and stored securely using Firebase cloud infrastructure protected by strict security rules and access controls. We do not sell or rent your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
            <p>
              If you have any questions regarding your data or wish to request data deletion, please contact us at{' '}
              <a href="mailto:india@erickson.co.in" className="text-[#FFD978] underline">
                india@erickson.co.in
              </a>.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-xs text-[#64757D]">
          © {new Date().getFullYear()} Erickson Coaching International India. All rights reserved.
        </div>
      </div>
    </div>
  );
}
