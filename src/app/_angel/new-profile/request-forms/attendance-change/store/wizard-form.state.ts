export interface MovementChange {
    id: string; // hareketin ID'si
    originalType: 'entry' | 'exit'; // eski yön
    newType: 'entry' | 'exit'; // yeni yön
}

export interface MovementDelete {
    id: string;
}

export interface MovementAdd {
    time: string;
    type: 'entry' | 'exit';
}

export interface PersonnelRequest {
    personnelId: string;
    fullName: string;
    changeMovements?: MovementChange[];
    deleteMovements?: MovementDelete[];
    addMovements?: MovementAdd[];
}

export interface WizardFormState {
    selectedAction: 'add_movement' | 'change_direction' | 'delete_movement' | null;
    personnelRequests: PersonnelRequest[];
}
