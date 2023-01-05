import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from './user/loginReducer';
import registerReducer from './user/registerReducer';
import currentUserReducer from './user/currentUser';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  currentUser: currentUserReducer,
});

export default rootReducer;
