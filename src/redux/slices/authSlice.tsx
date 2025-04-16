//* packages import
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';

interface auth {
  user: object;
  error: object | string | null;
  status: string;
}

// Declare and export a type for the slice's state
export type authState = auth;

const initialState: authState = {
  user: {},
  error: null,
  status: 'idel', //* 'idle' |  'loading' | 'succeeded' | 'failed'
};

const getUser = createAsyncThunk<
  // Return type of the payload creator
  object | AxiosError,
  // First argument to the payload creator
  string
  //   {
  //     // Optional fields for defining thunkApi field types
  //     dispatch: AppDispatch;
  //     state: State;
  //     extra: {
  //       jwt: string;
  //     };
  //     rejectValue: MyKnownError;
  //   }
>('auth/getUser', async (userId: string) => {
  console.log(userId);
  // Just make the async request here, and return the response.
  // This will automatically dispatch a `pending` action first,
  // and then `fulfilled` or `rejected` actions based on the promise.
  // as needed based on the
  // await axios
  //   .get('/todos')
  //   .then(response => {
  //     return response;
  //   })
  //   .catch(error => {
  //     throw error;
  //   });
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    addUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
    logout: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Use `extraReducers` to handle actions that were generated
    // _outside_ of the slice, such as thunks or in other slices
    builder
      .addCase(getUser.pending, state => {
        state.status = 'loading';
      })
      // Pass the generated action creators to `.addCase()`
      .addCase(getUser.fulfilled, (state, action: PayloadAction<object>) => {
        // Same "mutating" update syntax thanks to Immer
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action: AxiosError | string | any) => {
        state.status = 'failed';
        state.user = {};
        state.error = action.error.message;
      });
  },
});

export const {addUser, logout} = authSlice.actions;
export default authSlice.reducer;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const dispatchAddUser = (user: any) => (dispatch: any) => {
  dispatch(addUser(user));
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.auth.user)`
export const user = (state: {auth: {user: object}}) => state.auth.user;
