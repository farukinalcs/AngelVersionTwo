import { createAction, props } from "@ngrx/store";

// Actions
export const loadAccessGroups = createAction(
  '[Access Group] Load Access Groups',
  props<{ accessGroups: any[] }>()
);
export const loadAddedGroups = createAction(
  '[Access Group] Load Added Groups',
  props<{ addedGroups: any[] }>()
);
export const addItemToAddedGroups = createAction(
    '[AccessGroup] Add Item To Added Groups',
    props<{ item: any, isTemp: boolean, startDate: any, endDate: any, startTime: any, endTime: any, desc: any }>()
  );
  
  export const removeItemFromAddedGroups = createAction(
    '[AccessGroup] Remove Item From Added Groups',
    props<{ item: any, isTemp: boolean }>()
  );
