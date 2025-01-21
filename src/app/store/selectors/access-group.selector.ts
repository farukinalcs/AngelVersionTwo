import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccessGroupState } from '../models/access-group.state';

export const selectAccessGroupState =
  createFeatureSelector<AccessGroupState>('accessGroup');

export const selectAccessGroups = createSelector(
  selectAccessGroupState,
  (state) => state.accessGroups
);

export const selectAddedGroups = createSelector(
  selectAccessGroupState,
  (state) => state.addedGroups
);
