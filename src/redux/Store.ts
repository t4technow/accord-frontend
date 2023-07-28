import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userReducer } from './user/userSlice'
import serverSlice from './server/ServerSlice'


const rootReducer = combineReducers({
    user: userReducer,
    server: serverSlice,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Make sure 'user' is included in the whitelist
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedRootReducer,
});

export const persister = persistStore(Store);