'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeadFormData } from '@/types';
import { REQUIRE_PHONE } from '@/config/assessment';
import { Button } from '@/components/ui/Button';
import { Lock, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface LeadGateProps {
  overallScore: number;
  readinessBandLabel: string;
  onSubmitLead: (data: LeadFormData) => Promise<void>;
  isLoading?: boolean;
}

export const LeadGate: React.FC<LeadGateProps> = ({
  overallScore,
  readinessBandLabel,
  onSubmitLead,
  isLoading = false,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!firstName.trim()) {
      errs.firstName = 'First name is required';
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (REQUIRE_PHONE) {
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) {
        errs.phone = 'Phone number is required';
      } else if (trimmedPhone.length < 8) {
        errs.phone = 'Please enter a valid phone number with country code';
      }
    }

    if (!consent) {
      errs.consent = 'Please confirm consent to receive your results & information';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmitLead({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: role.trim(),
      city: city.trim(),
      marketingConsent: consent,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Score Teaser Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 text-center border-2 border-[#F4B740]/40 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#F4B740]/15 blur-3xl rounded-full pointer-events-none" />

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#167FA3]/30 border border-[#167FA3]/50 text-xs font-semibold text-[#FFD978] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Assessment Complete
        </span>

        <h2 className="text-sm uppercase tracking-widest text-[#64757D] font-bold mb-2">
          Your Coaching Readiness Score
        </h2>

        <div className="flex items-baseline justify-center gap-2 mb-3">
          <span className="text-5xl sm:text-7xl font-extrabold text-gradient-gold">
            {overallScore}
          </span>
          <span className="text-xl sm:text-2xl text-[#64757D] font-semibold">/ 100</span>
        </div>

        <div className="inline-block px-4 py-1.5 rounded-xl bg-[#0C3347] border border-[#FFD978]/30 text-white font-bold text-base sm:text-lg mb-4">
          {readinessBandLabel}
        </div>

        <p className="text-sm sm:text-base text-white/80 max-w-md mx-auto">
          Your full coaching readiness profile is ready to unlock.
        </p>
      </motion.div>

      {/* Unlock Benefits Card */}
      <div className="glass-card rounded-2xl p-5 mb-8 border border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFD978] mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#F4B740]" />
          What your report includes:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-white/90">
          {[
            'Your 5-dimension coaching breakdown',
            'Your strongest readiness signal',
            'Your biggest growth opportunity',
            'Your suggested coaching pathway',
            'Your personalised next steps',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F9D73] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Capture Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-white/15"
        noValidate
      >
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
          Enter your details to unlock your report
        </h3>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-white/90 mb-1.5">
              First Name <span className="text-[#F4B740]">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Ananya"
              className={`w-full px-4 py-3 rounded-xl bg-[#071E2A]/80 border ${
                errors.firstName ? 'border-red-400' : 'border-white/15 focus:border-[#F4B740]'
              } text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]`}
              required
            />
            {errors.firstName && (
              <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-white/90 mb-1.5">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Sharma"
              className="w-full px-4 py-3 rounded-xl bg-[#071E2A]/80 border border-white/15 focus:border-[#F4B740] text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]"
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-white/90 mb-1.5">
              Work Email / Email <span className="text-[#F4B740]">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya@company.com"
              className={`w-full px-4 py-3 rounded-xl bg-[#071E2A]/80 border ${
                errors.email ? 'border-red-400' : 'border-white/15 focus:border-[#F4B740]'
              } text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]`}
              required
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-white/90 mb-1.5">
              Phone Number {REQUIRE_PHONE && <span className="text-[#F4B740]">*</span>}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-3 rounded-xl bg-[#071E2A]/80 border ${
                errors.phone ? 'border-red-400' : 'border-white/15 focus:border-[#F4B740]'
              } text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]`}
              required={REQUIRE_PHONE}
            />
            {errors.phone && (
              <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Optional Role & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="role" className="block text-xs font-semibold text-white/90 mb-1.5">
              Current Role / Designation <span className="text-xs text-[#64757D]">(Optional)</span>
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. VP People / Consultant"
              className="w-full px-4 py-3 rounded-xl bg-[#071E2A]/80 border border-white/15 focus:border-[#F4B740] text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-semibold text-white/90 mb-1.5">
              City <span className="text-xs text-[#64757D]">(Optional)</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai / Bangalore / Delhi"
              className="w-full px-4 py-3 rounded-xl bg-[#071E2A]/80 border border-white/15 focus:border-[#F4B740] text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]"
            />
          </div>
        </div>

        {/* Marketing Consent */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded accent-[#F4B740] bg-[#071E2A] border-white/20 focus:ring-[#F4B740]"
            />
            <span className="text-xs text-white/80 leading-normal">
              I agree to receive my assessment report and information about Erickson Coaching India&apos;s ICF-accredited programmes, events, and coaching resources.{' '}
              <Link href="/privacy" className="text-[#FFD978] underline hover:text-white" target="_blank">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs text-red-400 mt-1">{errors.consent}</p>
          )}
        </div>

        {/* Submit CTA */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            showArrow
          >
            {isLoading ? 'Unlocking your profile...' : 'Unlock My Full Readiness Report'}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64757D] pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1F9D73]" />
          <span>Your information is protected. We respect your privacy.</span>
        </div>
      </motion.form>
    </div>
  );
};
