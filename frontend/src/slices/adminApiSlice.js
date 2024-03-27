import { apiSlice } from "./apiSlice";

const ADMIN_URL = '/api/admin'; 

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder)=>({
    adminLogin: builder.mutation({
      query: (data)=>({
        url:`${ADMIN_URL}/auth`,
        method: 'POST',
        body: data
      }),
    }),

    adminLogout: builder.mutation({ 
      query: () => ({ 
        url: `${ADMIN_URL}/logout`, 
        method: 'POST', 
      }) 
    }),
    registerUsersData: builder.mutation({
        query: (data)=>({
          url: `${ADMIN_URL}/`,
          method:"POST",
          body:data
        })
      }),

    
    getUsersData: builder.mutation({
      query: ()=>({
        url: `${ADMIN_URL}/users`,
        method:"GET",
      })
    }),

    deleteUser: builder.mutation({
      query: (data)=>({
        url : `${ADMIN_URL}/users/delete?id=${data}`,
        method: 'DELETE',
      })
    }),

    updateUserAdmin: builder.mutation({
      query: (data)=>({
        url: `${ADMIN_URL}/users/updateUser`,
        method:'PUT',
        body:data
      })
    }),

  })
})


export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetUsersDataMutation,
  useDeleteUserMutation,
  useUpdateUserAdminMutation,
  useRegisterUsersDataMutation
} = adminApiSlice