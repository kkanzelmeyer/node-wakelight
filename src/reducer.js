/*
 *
 * Settings reducer
 *
 */

import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions';

// Actions
export const updateAlarms = createAction('UPDATE_ALARMS');

/**
 * The initial state of the settings
 * @type {Object}
 */
const initialState = fromJS({});

const handleUpdateAlarm = (state, action) => state.set('alarms', fromJS(action.payload));

// Root reducer
const alarmReducer = handleActions({
  [updateAlarms]: handleUpdateAlarm,
}, initialState);

export default alarmReducer;
