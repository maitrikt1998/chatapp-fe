import { configureStore } from "@reduxjs/toolkit";
import registerReducer from './registrationSlice';
import userReducer from './userSlice';


const store = configureStore({
    reducer:{
        register: registerReducer,
        user : userReducer
    }
});

export default store;