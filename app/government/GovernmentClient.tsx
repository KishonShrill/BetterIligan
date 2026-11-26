"use client";

import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import SubpageNav from "@/components/ui/SubpageNav";
import SubpageHero from "@/components/ui/SubpageHero";
import FilterGrid from "@/components/ui/FilterGrid";
import iliganDirectories from "@/data/navigation.json";
import { useTranslation } from "react-i18next";
import "@/translation/i18n";

const section = iliganDirectories.find((item) => item.name === "Government")!;

export default function GovernmentClient() {
  const { t } = useTranslation("government");

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans">
      <SubpageNav href="/" text={t("goHome")} />
      <SubpageHero>
        <SubpageHero.Title>{t("title")}</SubpageHero.Title>
        <SubpageHero.Description>{t("description")}</SubpageHero.Description>
      </SubpageHero>

      <FilterGrid>
        <FilterGrid.Content
          title={t("directories")}
          itemCount={section.dropdown.length - 1}
          columns={2}
          hasSidebar={false}
        >
          {section.dropdown.map(
            (item, index) =>
              index != 0 && (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Landmark className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="line-clamp-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-1 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-blue-600">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Link>
              ),
          )}
        </FilterGrid.Content>
      </FilterGrid>
    </main>
  );
}
