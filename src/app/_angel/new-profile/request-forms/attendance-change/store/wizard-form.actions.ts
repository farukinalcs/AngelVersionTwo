import { createAction, props } from '@ngrx/store';
import { MovementAdd, MovementChange, MovementDelete, PersonnelRequest } from './wizard-form.state';

export const setSelectedAction = createAction(
    '[WizardForm] Set Selected Action',
    props<{ action: 'add_movement' | 'change_direction' | 'delete_movement' }>()
);

export const addPersonnel = createAction(
    '[WizardForm] Add Personnel',
    props<{ personnel: PersonnelRequest }>()
);

export const updatePersonnelMovements = createAction(
    '[WizardForm] Update Personnel Movements',
    props<{
        personnelId: string;
        changes: {
            addMovements?: MovementAdd[];
            changeMovements?: MovementChange[];
            deleteMovements?: MovementDelete[];
        };
    }>()
);

export const resetWizardForm = createAction('[WizardForm] Reset Wizard Form');


export const removePersonnelMovement = createAction(
    '[WizardForm] Remove Personnel Movement',
    props<{
        personnelId: string;
        movementType: 'change' | 'delete' | 'add';
        movementId: string;
    }>()
);