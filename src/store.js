import { createStore } from 'redux';
import alarmsReducer from './reducer';

const store = createStore(alarmsReducer);
export default store;
