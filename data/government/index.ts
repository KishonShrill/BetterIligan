import { AgencyArraySchema } from '@/validations/agencySchema';

import governmentDirectories from './national-departments.json';

export const allAgencies = AgencyArraySchema.parse(governmentDirectories.sort((a, b) => a.name.localeCompare(b.name)));
