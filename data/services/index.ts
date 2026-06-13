import { ServicesArraySchema } from '@/validations/serviceSchema';

import business from './business.json';
import certificates from './certificates.json';
import health from './health.json';
import infrastructure from './infrastructure.json';
import transport from './transport.json';
import animals from './animals.json';

const rawServices = [
    ...business,
    ...certificates,
    ...health,
    ...infrastructure,
    ...transport,
    ...animals
]

export const allServices = ServicesArraySchema.parse(rawServices);
