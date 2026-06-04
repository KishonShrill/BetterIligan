export interface RequirementGroup {
    groupName: string;
    items: string[];
}

export interface ProcedureStep {
    stepNumber: number;
    clientAction: string;
    providerAction: string;
    duration: string;
    personInCharge: string;
    fee: string;
}

export interface GovernmentService {
    slug: string;
    title: string;
    category: string;
    description: string;
    source: 'official' | 'community';
    isWalkIn: boolean;
    isOnline: boolean;
    department: string;
    schedule: string;
    whoMayAvail: string;
    requirements: RequirementGroup[];
    procedures: ProcedureStep[];
}
