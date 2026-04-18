"use client";
import { Star, CheckCircle2, Mail } from "lucide-react";

const steps = [
  "Our team matches you with a pre-qualified VIP student",
  "We schedule an intro call between you and the student",
  "Student confirms they want to proceed with you",
  "You pay a one-time introduction fee via the link we email you",
  "Start teaching — no credits or commissions after that",
];

const benefits = [
  "Students have already paid ₹2,000 and are serious about learning",
  "We handle the intro call so you don't waste time on no-shows",
  "One-time fee instead of per-contact credits",
  "Long-term students who are committed to regular classes",
];

export default function VipTutorTab({ listing }) {
  const isVip = listing?.isVipEligible;

  if (isVip) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
            <Star className="w-4 h-4" />
            VIP Tutor
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            You're in the VIP tutor pool
          </h2>
          <p className="text-sm text-gray-600">
            When we match you with a VIP student, you'll receive an email with
            the student's details and a payment link for the one-time
            introduction fee.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            How it works
          </h3>
          <ol className="space-y-2">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Earn more with VIP students
            </h2>
            <p className="text-sm text-gray-600">
              Our team recommends you to pre-qualified students who have already
              paid ₹2,000 to find a tutor. These students are serious, committed,
              and ready to start.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">What you get</h3>
        <ul className="space-y-2">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-800">
          VIP eligibility is set by our team based on your profile and ratings.
          To express your interest, email{" "}
          <a
            href="mailto:vip@tuitionsinindia.com"
            className="font-semibold underline"
          >
            vip@tuitionsinindia.com
          </a>
        </p>
      </div>
    </div>
  );
}
