import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
    
  },  
});

export default userSlice.reducer;