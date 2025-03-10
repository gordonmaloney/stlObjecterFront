import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import service from "./Service";

const initialState = {
  applications: []
};

//Get postcodes
export const getApplications = createAsyncThunk(
  "applications/fetch",
  async () => {
    try {
      return await service.getApplications();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        return (message)
    }
  }
);

export const slice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications = action.payload;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export const { reset } = slice.actions;
export default slice.reducer;
