import { combineReducers } from '@reduxjs/toolkit';
import loginReducer from './user/loginReducer';
import registerReducer from './user/registerReducer';
import currentUserReducer from './user/currentUser';
import projectsReducer from './projects/projectsReducer';
import ticketsReducer from './tickets/ticketsReducer';
import projectReducer from './projects/projectReducer';
import ticketReducer from './tickets/ticketReducer';
import notificationReducer from './notifications/notificationReducer';

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  currentUser: currentUserReducer,
  projects: projectsReducer,
  project: projectReducer,
  tickets: ticketsReducer,
  ticket: ticketReducer,
  notifications: notificationReducer,
});

export default rootReducer;
