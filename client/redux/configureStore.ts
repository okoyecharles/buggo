import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import errorMiddleware from './middleware/error';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware),
});

export type storeType = ReturnType<typeof store.getState>;
export default store;
