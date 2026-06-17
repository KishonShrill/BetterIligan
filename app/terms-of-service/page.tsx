import { Metadata } from 'next';
import SubpageNav from '@/components/ui/SubpageNav';
import SubpageHero from '@/components/ui/SubpageHero';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for BetterIliganCity.org.',
};

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-slate-50 font-sans pb-24">

            <SubpageNav href='/' text='Go Home' />
            <SubpageHero>
                <SubpageHero.Title>Terms of Service</SubpageHero.Title>
                <SubpageHero.Description>
                    Last updated: June 17, 2026
                </SubpageHero.Description>
            </SubpageHero>

            <div className="max-w-[800px] mx-auto px-4 md:px-6 py-12">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-slate-600 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            Agreement to Our Legal Terms
                        </h2>
                        <p className="mb-4">
                            We are BetterIliganCity.org (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; &quot;our&quot;), registered in the Philippines at Iligan City, Lanao del Norte 9200. We operate the website <a href="http://betteriligancity.org/" className="text-blue-600 hover:text-blue-700 hover:underline">http://betteriligancity.org/</a> (the &quot;Site&quot;).
                        </p>
                        <p className="mb-4">
                            BetterIliganCity.org is a volunteer-led civic tech initiative to digitalize and streamline access to local governance, policies, and open data for the City of Iligan, Northern Mindanao, Philippines.
                        </p>
                        <p>
                            These Legal Terms constitute a legally binding agreement made between you and BetterIliganCity.org concerning your access to and use of the Services. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            1. Our Services
                        </h2>
                        <p>
                            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            2. Intellectual Property Rights
                        </h2>
                        <p>
                            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the &quot;Content&quot;).
                        </p>
                        <p className="mt-4">
                            As a civic tech initiative, while we protect our proprietary codebase and specific website design, we acknowledge that public directory information, government contact details, and open civic data hosted on this platform are public domain and not our intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            3. Prohibited Activities
                        </h2>
                        <p className="mb-4">By accessing and using this website, you agree not to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Submit false, inaccurate, fabricated, or misleading information through our suggestion or report forms.</li>
                            <li>Impersonate any person or entity, including any government official, LGU representative, or website administrator.</li>
                            <li>Use automated scripts, scrapers, or bots in a manner that imposes an unreasonable or disproportionately large load on our server infrastructure.</li>
                            <li>Extract contact information from our directory for the purpose of sending unsolicited marketing, spam, or engaging in harassment.</li>
                            <li>Use the information provided on this directory to harass, threaten, or abuse any public official, agency, or individual.</li>
                            <li>Interfere with, disrupt, or attempt to gain unauthorized access to the website&apos;s servers or networks.</li>
                            <li>Use the website for any unlawful purpose, including violating the Philippine Cybercrime Prevention Act of 2012 (RA 10175).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            4. Disclaimer & Limitations of Liability
                        </h2>
                        <p className="mb-4">
                            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF.
                        </p>
                        <p className="mb-4">
                            <strong>Directory Information:</strong> This is a community-driven directory. We do not guarantee the current validity of any contact information or service details listed. We are not officially affiliated with the government agencies, LGUs, or private entities listed herein.
                        </p>
                        <p>
                            <strong>Tools and Calculators:</strong> Any calculators, tools, or estimates provided on this website are for informational purposes only. They are not official billing statements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            5. User Data
                        </h2>
                        <p>
                            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services. You agree that we shall have no liability to you for any loss or corruption of any such data. Please refer to our <Link className='text-blue-600 hover:text-blue-700 hover:underline' href={"/privacy-policy"}>Privacy Policy</Link> for more details.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            6. Governing Law
                        </h2>
                        <p>
                            These Legal Terms shall be governed by and defined following the laws of the Philippines. BetterIliganCity.org and yourself irrevocably consent that the courts of the Philippines shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
                            7. Contact Us
                        </h2>
                        <p>
                            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:{' '}
                            <a href="mailto:report@betteriligancity.org" className="text-blue-600 hover:text-blue-700 hover:underline">
                                report@betteriligancity.org
                            </a>.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
