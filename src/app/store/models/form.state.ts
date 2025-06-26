export interface FormState {
    personalInfo: any;
    contactInfo: any;
    organizationInfo: any;
    customInfo: any;
    shiftInfo: any;
    accessInfo: any;
    applicationUse : any;
}

export const initialFormState: FormState = {
    personalInfo: null,
    contactInfo: null,
    organizationInfo: null,
    customInfo: null,
    shiftInfo: null,
    accessInfo: null,
    applicationUse: null
};
