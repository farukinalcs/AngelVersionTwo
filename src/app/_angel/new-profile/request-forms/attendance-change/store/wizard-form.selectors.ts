import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WizardFormState } from './wizard-form.state';

export const selectWizardFormState = createFeatureSelector<WizardFormState>('wizardForm');

export const selectSelectedAction = createSelector(
    selectWizardFormState,
    (state) => state.selectedAction
);

export const selectAllPersonnelRequests = createSelector(
    selectWizardFormState,
    (state) => state.personnelRequests
);

export const selectPersonnelRequestById = (personnelId: string) =>
    createSelector(selectAllPersonnelRequests, (requests) =>
        requests.find((p) => p.personnelId === personnelId)
    );
