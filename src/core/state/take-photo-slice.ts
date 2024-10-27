import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type CameraCapturedPicture } from 'expo-camera/build/Camera.types';

interface TakePhotoState {
  takePhoto: CameraCapturedPicture | null;
}

const initialState: TakePhotoState = {
  takePhoto: null,
};

export const takePhotoSlice = createSlice({
  name: 'takePhoto',
  initialState,
  reducers: {
    setPhoto: (state, action: PayloadAction<CameraCapturedPicture>) => {
      state.takePhoto = action.payload;
    },
    acknowledgePhoto: (state) => {
      state.takePhoto = null;
    },
  },
});

export const { setPhoto, acknowledgePhoto } = takePhotoSlice.actions;

export default takePhotoSlice.reducer;
