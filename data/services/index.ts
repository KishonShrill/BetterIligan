import { ServicesArraySchema } from '@/validations/serviceSchema';

import business from './business.json';
import certificates from './certificates.json';
import health from './health.json';
import infrastructure from './infrastructure.json';
import transport from './transport.json';

const rawServices = [
    ...business,
    ...certificates,
    ...health,
    ...infrastructure,
    ...transport,
]

// Combine them all into one flat array and cast it to your type
export const allServices = ServicesArraySchema.parse(rawServices);
