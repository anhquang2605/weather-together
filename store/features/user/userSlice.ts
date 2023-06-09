import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserData } from './../../../libs/users'; // replace with your function

// Async action to fetch user data
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      const user = await getUserData(typeof id === 'string' ? id : "");
      return JSON.stringify(user);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = JSON.parse(action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
      });
  },
});

export default userSlice.reducer;