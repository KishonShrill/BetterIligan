import { DepartmentArraySchema } from '@/validations/agencySchema';

import iliganDepartments from './departments.json';

export const allDepartments = DepartmentArraySchema.parse(iliganDepartments.sort((a, b) => a.name.localeCompare(b.name)));
