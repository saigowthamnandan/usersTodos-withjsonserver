import { configureStore } from '@reduxjs/toolkit';
import todoSlice from '../features/todo/taskSlice';


export const store = configureStore({
  reducer: {
    task: todoSlice,
  },
});
