import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from './user/loginReducer';
import registerReducer from './user/registerReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export default rootReducer;
