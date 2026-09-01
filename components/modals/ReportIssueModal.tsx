"use client";

import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  X,
  Send,
  AlertCircle,
  Loader2,
  Github,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
// import { submitReport } from '@/actions/report'; // <-- Update this to your actual server action

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIssueModal({
  isOpen,
  onClose,
}: ReportIssueModalProps) {
  const [reportType, setReportType] = useState<"info" | "bug">("info");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      const captchaToken = recaptchaRef.current?.getValue();
      if (!captchaToken && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        setStatus("error");
        return;
      }

      const formData = new FormData(e.currentTarget);

      // --- REPLACE WITH YOUR ACTUAL BACKEND/SERVER ACTION ---
      // const result = await submitReport(formData, captchaToken);

      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = { success: true };

      if (result?.success) {
        setStatus("success");
      } else {
        toast.error("Failed to submit report.");
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error("Report submission failed:", error);
      toast.error("An unexpected error occurred.");
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset state when closing so it's fresh next time it opens
  const handleClose = () => {
    setStatus("idle");
    setReportType("info");
    onClose();
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm duration-200">
      <div className="custom-scrollbar animate-in zoom-in-95 relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">Report an Issue</h2>
          <button
            onClick={handleClose}
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
              Thank you for helping keep BetterIligan accurate. Our moderators
              will review your report shortly.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 rounded-xl bg-slate-100 px-6 py-2.5 font-bold text-slate-700 transition-colors hover:bg-slate-200"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* Submission Type Toggle */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">
                What kind of issue is this?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="info"
                    checked={reportType === "info"}
                    onChange={() => setReportType("info")}
                    className="peer sr-only"
                  />
                  <div className="flex h-full items-center justify-center rounded-xl border-2 border-slate-200 p-3 text-center text-sm font-bold text-slate-500 transition-all peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 hover:border-orange-300">
                    Outdated / Incorrect Info
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="bug"
                    checked={reportType === "bug"}
                    onChange={() => setReportType("bug")}
                    className="peer sr-only"
                  />
                  <div className="flex h-full items-center justify-center rounded-xl border-2 border-slate-200 p-3 text-center text-sm font-bold text-slate-500 transition-all peer-checked:border-slate-800 peer-checked:bg-slate-800 peer-checked:text-white hover:border-slate-400">
                    Website Bug / Error
                  </div>
                </label>
              </div>
            </div>

            {/* CONDITIONAL RENDERING BASED ON TYPE */}
            {reportType === "bug" ? (
              <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                  <Github className="h-6 w-6 text-slate-800" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-slate-900">
                    Found a technical bug?
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    If you're a programmer and you see a bug or you want to help
                    a maintainer out, please file an issue directly on our
                    open-source repository.
                  </p>
                </div>
                <a
                  href="https://github.com/KishonShrill/BetterIligan/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-bold text-white shadow-sm transition-all hover:bg-slate-800"
                >
                  Open GitHub Issues <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-300"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Which info is outdated or incorrect?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="targetInfo"
                    placeholder="e.g. Health Office Contact Number, Business Permit Requirements"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Explain the correction{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    name="description"
                    rows={4}
                    placeholder="Why is it outdated? What is the correct information?"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Reference Link{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    name="referenceUrl"
                    placeholder="Link to official Facebook post or updated source"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Your Email{" "}
                    <span className="font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="In case we need to clarify details"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 transition-all outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Submit Correction"
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
