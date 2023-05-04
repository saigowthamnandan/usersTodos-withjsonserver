import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users : [],
    id : null,
    todos : []
}
export const taskSlice = createSlice(
    {
        name : 'task',
        initialState,
        reducers:{
            setusers : (state,action) => {  
                state.users = action.payload;
            },
            setId  : (state,action) => {
                state.id = action.payload;
            },
            setTodos : (state,action) => {
                state.todos = action.payload;
            }
        }
    }
)
export const {setusers, setId, setTodos} = taskSlice.actions;
export default taskSlice.reducer;