import { Phone, LifeBuoy, Flame, Shield, Cross, ArrowRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import Button3D from '@/components/ui/Button3D';

// Iligan-published landlines are 7-digit local numbers; prepend the area code so
// tap-to-call routes from mobile. Numbers mirror the /disaster hotlines.
function telHref(display: string): string {
    const cleaned = display.replace(/[^+\d]/g, '');
    return `tel:${cleaned.length === 7 ? `063${cleaned}` : cleaned}`;
}

const CONTACTS = [
    { label: 'National Emergency', number: '911', Icon: Phone, color: '#dc2626' },
    { label: 'Rescue / CDRRMO', number: '811', Icon: LifeBuoy, color: '#059669' },
    { label: 'Fire', number: '160', Icon: Flame, color: '#ea580c' },
    { label: 'Police', number: '167', Icon: Shield, color: '#2563eb' },
    { label: 'Ambulance', number: '221-0081', Icon: Cross, color: '#dc2626' },
];

export default function EmergencyHotlines() {
    return (
        <Section>
            <div className="text-center mb-7 sm:mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                    Emergency Hotlines
                </h2>
                <Text className="text-slate-500 max-w-2xl mx-auto text-sm md:text-base" size="md">
                    Save these before you need them. Tap any number to call.
                </Text>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {CONTACTS.map(({ label, number, Icon, color }) => (
                    <a
                        key={label}
                        href={telHref(number)}
                        aria-label={`Call ${label} at ${number}`}
                        className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                    >
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}1a` }}>
                            <Icon className="h-6 w-6" style={{ color }} aria-hidden />
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                        <span className="flex items-center gap-1 text-lg font-extrabold" style={{ color }}>
                            <Phone className="h-4 w-4" aria-hidden /> {number}
                        </span>
                    </a>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Button3D
                    text="Disaster Preparedness Hub"
                    href="/disaster"
                    variant="blue"
                    icon={ArrowRight}
                    iconPosition="right"
                />
            </div>
        </Section>
    );
}
