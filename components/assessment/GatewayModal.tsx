'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Lock, Sparkles, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface GatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGateway: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => Promise<void>;
}

export const GatewayModal: React.FC<GatewayModalProps> = ({
  isOpen,
  onClose,
  onSubmitGateway,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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

    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      errs.phone = 'Phone number is required';
    } else if (trimmedPhone.length < 8) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!consent) {
      errs.consent = 'Please confirm consent to proceed';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmitGateway({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });
    } catch (err) {
      console.error('Gateway modal error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border-2 border-[#F4B740]/40 shadow-2xl relative overflow-hidden text-left"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F4B740]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <BrandLogo size="sm" className="mb-3" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#167FA3]/30 border border-[#167FA3]/50 text-xs font-semibold text-[#FFD978] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 2 · Quick Registration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Start Your Coaching Readiness Profile
            </h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Enter your details to generate and save your personalised 3-minute assessment results.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="gateFirstName" className="block text-xs font-semibold text-white/90 mb-1">
                  First Name <span className="text-[#F4B740]">*</span>
                </label>
                <input
                  id="gateFirstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Ananya"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#071E2A]/90 border ${
                    errors.firstName ? 'border-red-400' : 'border-white/15 focus:border-[#F4B740]'
                  } text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]`}
                  required
                />
                {errors.firstName && (
                  <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="gateLastName" className="block text-xs font-semibold text-white/90 mb-1">
                  Last Name
                </label>
                <input
                  id="gateLastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#071E2A]/90 border border-white/15 focus:border-[#F4B740] text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="gateEmail" className="block text-xs font-semibold text-white/90 mb-1">
                Email Address <span className="text-[#F4B740]">*</span>
              </label>
              <input
                id="gateEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@company.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#071E2A]/90 border ${
                  errors.email ? 'border-red-400' : 'border-white/15 focus:border-[#F4B740]'
                } text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]`}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="gatePhone" className="block text-xs font-semibold text-white/90 mb-1">
                Phone Number <span className="text-[#F4B740]">*</span>
              </label>
              <input
                id="gatePhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#071E2A]/90 border ${
                  errors.phone ? 'border-red-400' : 'border-white/15 focus:border-[#F4B740]'
                } text-white placeholder-[#64757D] text-sm focus:outline-none focus:ring-1 focus:ring-[#F4B740]`}
                required
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Consent */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-[#F4B740] bg-[#071E2A] border-white/20"
                />
                <span className="text-[11px] text-white/80 leading-normal">
                  I agree to receive my readiness report and information from Erickson Coaching India.{' '}
                  <Link href="/privacy" className="text-[#FFD978] underline" target="_blank">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.consent && (
                <p className="text-xs text-red-400 mt-1">{errors.consent}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isSubmitting}
                showArrow
              >
                {isSubmitting ? 'Saving Details...' : 'Begin 3-Minute Assessment'}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64757D] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F9D73]" />
              <span>Your privacy is protected. 100% confidential.</span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
