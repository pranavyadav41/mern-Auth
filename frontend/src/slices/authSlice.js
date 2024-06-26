import {createSlice} from '@reduxjs/toolkit'

const initialState={
    userInfo:localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem
        ('userInfo')) :null,
    adminInfo:localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem
            ('adminInfo')) :null,
    count:0
    
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCredentials:(state,action)=>{
            state.userInfo=action.payload;
            localStorage.setItem('userInfo',JSON.stringify(action.payload));
        },
        logout:(state,action)=>{
            state.userInfo=null;
            localStorage.removeItem('userInfo');
        },

        setAdminCredentials:(state,action)=>{
            state.adminInfo = action.payload
            localStorage.setItem('adminInfo',JSON.stringify(action.payload))
        },
        adminLogout:(state)=>{
            state.adminInfo=null
            localStorage.removeItem('adminInfo');
        },
        add:(state)=>{
            
                state.count=state.count+1
        },
        decrement:(state)=>{
                state.count=state.count-3
        }
    }
})

export const {setCredentials,logout,setAdminCredentials,adminLogout,add,decrement} = authSlice.actions;

export default authSlice.reducer;