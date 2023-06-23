import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../../types/User';
interface UserState {
  data: User | null,
  status: string,
  error: string | null,
}
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data : null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    userLoaded: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      
      state.data = action.payload;
    },
    updateUser: (state, action) => { 
      state.data = action.payload;
    }

  },  
});

export default userSlice.reducer;

export const { userLoaded, updateUser } = userSlice.actions;