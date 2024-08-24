import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./reducers/globalReducer";
import userReducer from "./reducers/userReducer";



export const store = configureStore({
    reducer:{
        userReducer,
        globalReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;