import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userReducer } from './user/userSlice'
import serverSlice from './server/ServerSlice'
import friendsSlice from './chat/friendsSlice'
import onlineUsers from './chat/onlineUsers'


const rootReducer = combineReducers({
    user: userReducer,
    server: serverSlice,
    friends: friendsSlice,
    onlineUsers: onlineUsers,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedRootReducer,
});

export const persister = persistStore(Store);