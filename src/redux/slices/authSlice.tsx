//* packages import
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios, {AxiosError} from 'axios';
import {isEqual} from 'lodash';

//* types import
import {User} from '@Types/userTypes';

interface auth {
  user: User | null;
  error: object | string | null;
  status: string;
}

// Declare and export a type for the slice's state
export type authState = auth;

const initialState: authState = {
  user: null,
  error: null,
  status: 'idle', //* 'idle' |  'loading' | 'succeeded' | 'failed'
};

// const getUser = createAsyncThunk<
//   // Return type of the payload creator
//   User | null | AxiosError,
//   // First argument to the payload creator
//   string
//   //   {
//   //     // Optional fields for defining thunkApi field types
//   //     dispatch: AppDispatch;
//   //     state: State;
//   //     extra: {
//   //       jwt: string;
//   //     };
//   //     rejectValue: MyKnownError;
//   //   }
// >('auth/getUser', async (userId: string) => {
//   try {
//     const response = await axios.get(`/api/users/${userId}`);
//     return response.data;
//   } catch (error) {
//     console.log('🚀 ~ > ~ error:', error);
//     if (error instanceof AxiosError) {
//       return error;
//     }
//     return null;
//   }
// });

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    editUser: (state, action: PayloadAction<object | null>) => {
      // Only update if there are actual changes
      if (action.payload && state.user) {
        const updatedUser = {
          ...state.user,
          ...action.payload,
        };
        // Use lodash isEqual for deep comparison of objects
        if (!isEqual(updatedUser, state.user)) {
          state.user = updatedUser;
        }
      }
    },
    logout: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Use `extraReducers` to handle actions that were generated
    // _outside_ of the slice, such as thunks or in other slices
    // builder
    //   .addCase(getUser.pending, state => {
    //     state.status = 'loading';
    //   })
    //   // Pass the generated action creators to `.addCase()`
    //   //! remove any type when add the new user request
    //   .addCase(
    //     getUser.fulfilled,
    //     (state, action: PayloadAction<User | any>) => {
    //       // Same "mutating" update syntax thanks to Immer
    //       state.status = 'succeeded';
    //       state.user = action.payload;
    //     },
    //   )
    //   .addCase(getUser.rejected, (state, action: AxiosError | string | any) => {
    //     state.status = 'failed';
    //     state.user = null;
    //     state.error = action.error.message;
    //   });
  },
});

export const {addUser, logout} = authSlice.actions;
export default authSlice.reducer;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const dispatchAddUser = (user: User | null) => (dispatch: any) => {
  dispatch(addUser(user));
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.auth.user)`
export const user = (state: {auth: {user: User | null}}) => state.auth.user;
