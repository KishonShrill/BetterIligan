"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { X, Send, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { submitContribution } from "@/actions/contribute";
import { headerDropdown } from "@/data/categories";

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContributionModal({
  isOpen,
  onClose,
}: ContributionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const captchaToken = recaptchaRef.current?.getValue();
      if (!captchaToken && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        toast.error("Please complete the CAPTCHA.");
        return;
      }

      const formData = new FormData(e.currentTarget);
      const result = await submitContribution(formData, captchaToken as string);

      if (result?.success) {
        toast.success(
          "Sent Successfully! Our moderators will review this shortly.",
        );
        onClose();
      } else {
        toast.error((result?.error as any) || "Failed to submit.");
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error("Contribution submission failed:", error);
      toast.error("An unexpected error occurred.");
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="custom-scrollbar animate-in zoom-in-95 relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">
            Contribute to BetterIligan
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Send className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">
              Sent Successfully!
            </h3>
            <p className="text-slate-500">
              Thank you for helping improve our city's directory. Our moderators
              will review this shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Submission Type */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">
                What would you like to do?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="suggest"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <div className="rounded-xl border-2 border-slate-200 p-3 text-center font-medium text-slate-500 transition-all peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:border-blue-300">
                    Suggest New Service
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="report"
                    className="peer sr-only"
                  />
                  <div className="rounded-xl border-2 border-slate-200 p-3 text-center font-medium text-slate-500 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 hover:border-orange-300">
                    Report an Update/Fix
                  </div>
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Service Name / Office
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="e.g. City Health Office"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Category
              </label>
              <select
                required
                name="category"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-500 transition-all outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="">Select a category...</option>
                {headerDropdown.map((subItem) => (
                  <option key={subItem.name} value={subItem.name}>
                    {subItem.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Details, Procedures, or Links
              </label>
              <textarea
                required
                name="details"
                rows={4}
                placeholder="Paste requirements, Facebook links, or describe the procedures here..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Your Email{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="In case we need to clarify details"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Google reCAPTCHA */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex justify-center pt-2">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                />
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Please complete the CAPTCHA or try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-slate-800 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Submit to Moderators"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
