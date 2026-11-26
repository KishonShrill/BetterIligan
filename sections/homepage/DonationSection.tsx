"use client";

import Section from "@/components/ui/Section";
import {
  HeartHandshake,
  Wallet,
  Landmark,
  PackageOpen,
  MapPin,
} from "lucide-react";
import donationJSON from "@/data/bangon/incident.json";
import type { BangonConfig } from "@/validations/bangonSchema";
import { useTranslation } from "react-i18next";
import "@/translation/i18n";

export default function DonationSection() {
  const { t } = useTranslation("home");
  const donation: BangonConfig["donation"] = donationJSON.donation;
  if (!donationJSON.active || !donationJSON.displayDonation) return null;
  return (
    <Section aria-labelledby="donate-heading" className="bg-red-50">
      <div className="mb-4 flex items-center gap-2">
        <HeartHandshake className="h-6 w-6 text-emerald-600" />
        <h2 id="donate-heading" className="text-2xl font-bold text-slate-900">
          {t("howToHelp")}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Wallet className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold">GCash</h3>
          </div>
          <dl className="mt-3 space-y-1 text-sm">
            <Row label={t("accountName")} value={donation.gcash.name} />
            <Row label={t("accountNo")} value={donation.gcash.number} mono />
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Landmark className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold">{t("bankTransfer")}</h3>
          </div>
          <dl className="mt-3 space-y-1 text-sm">
            <Row label="Bank" value={donation.bank.bank} />
            <Row label={t("accountName")} value={donation.bank.accountName} />
            <Row
              label={t("accountNo")}
              value={donation.bank.accountNumber}
              mono
            />
          </dl>
        </div>
      </div>

      {donation.inKindNeeds.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <PackageOpen className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold">{t("mostNeededGoods")}</h3>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {donation.inKindNeeds.map((item) => (
              <li
                key={item}
                className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {donation.dropOff.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold">{t("dropOffPoints")}</h3>
          </div>
          <ul className="mt-3 space-y-2">
            {donation.dropOff.map((d) => (
              <li key={d.name} className="text-sm">
                <span className="font-bold text-slate-800">{d.name}</span>
                <span className="text-slate-500"> — {d.address}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`font-bold text-slate-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
