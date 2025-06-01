// store.ts
import { createSlice, configureStore } from "@reduxjs/toolkit";
import { IUserData } from "../interfaces/signup";

const userdata: IUserData = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const initialState = {
  userdata,
  token: "",
  hasAuth: false,
  globalLoad: false,
  internalLoad: false
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userdata = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setHasAuth: (state, action) => {
      state.hasAuth = action.payload;
    },
    setGlobalLoad: (state, action) => {
      state.globalLoad = action.payload;
    },
    setInternalLoad: (state, action) => {
      state.internalLoad = action.payload;
    },
  },
});

export const { setUserData,setGlobalLoad, setToken, setHasAuth,setInternalLoad  } = appSlice.actions;



export const appStore = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

