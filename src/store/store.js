import { combineReducers, configureStore } from '@reduxjs/toolkit'
import  authReducer  from './slices/authSlice'
import { persistReducer, persistStore,FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import contentReducer from './slices/contentSlice';
import subDomainSlice from './slices/domainSlice';
import thunk from 'redux-thunk'

const reducers = combineReducers({
  auth: authReducer,
  content: contentReducer,
  subdomain: subDomainSlice
});

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

  devTools: true,
  
})