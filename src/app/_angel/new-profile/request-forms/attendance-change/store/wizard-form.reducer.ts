import { createReducer, on } from '@ngrx/store';
import * as WizardFormActions from './wizard-form.actions';
import { WizardFormState } from './wizard-form.state';

export const initialState: WizardFormState = {
    selectedAction: null,
    personnelRequests: []
};

export const wizardFormReducer = createReducer(
    initialState,

    on(WizardFormActions.setSelectedAction, (state, { action }) => ({
        ...state,
        selectedAction: action
    })),

    on(WizardFormActions.addPersonnel, (state, { personnel }) => ({
        ...state,
        personnelRequests: [...state.personnelRequests, personnel]
    })),

    on(WizardFormActions.updatePersonnelMovements, (state, { personnelId, changes }) => ({
        ...state,
        personnelRequests: state.personnelRequests.map(p =>
            p.personnelId === personnelId
                ? {
                    ...p,
                    changeMovements: changes.changeMovements
                        ? [
                            ...(p.changeMovements || []).filter(m => !changes.changeMovements!.some(c => c.id === m.id)),
                            ...changes.changeMovements
                        ]
                        : p.changeMovements,

                    deleteMovements: changes.deleteMovements
                        ? [
                            ...(p.deleteMovements || []).filter(m => !changes.deleteMovements!.some(c => c.id === m.id)),
                            ...changes.deleteMovements
                        ]
                        : p.deleteMovements
                }
                : p
        )
    })),

    on(WizardFormActions.resetWizardForm, () => initialState),

    on(WizardFormActions.removePersonnelMovement, (state, { personnelId, movementType, movementId }) => ({
        ...state,
        personnelRequests: state.personnelRequests.map(p =>
            p.personnelId === personnelId
                ? {
                    ...p,
                    changeMovements:
                        movementType === 'change'
                            ? (p.changeMovements || []).filter(m => m.id !== movementId)
                            : p.changeMovements,
                    deleteMovements:
                        movementType === 'delete'
                            ? (p.deleteMovements || []).filter(m => m.id !== movementId)
                            : p.deleteMovements
                }
                : p
        )
    }))

);
