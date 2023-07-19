import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userReducer } from './user/userSlice'

const persistConfig = {
    key: "root",
    storage,
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)

export const Store = configureStore({
    reducer: {
        user: persistedUserReducer
    }
})

export const persister = persistStore(Store)