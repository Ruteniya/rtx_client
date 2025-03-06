import { Pto } from '@rtx/types'
import { apiSlice } from './api-slice'

export const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Pto.Categories.CategoryList, void>({
      query: () => {
        return {
          url: `categories`,
          method: 'GET'
        }
      },
      providesTags: ['Categories']
    }),
    createCategory: builder.mutation<Pto.Categories.Category, Pto.Categories.CreateCategory>({
      query: (data) => {
        return {
          url: `categories`,
          method: 'POST',
          body: data
        }
      },
      invalidatesTags: ['Categories']
    }),
    updateCategory: builder.mutation<Pto.Categories.Category, { id: string; data: Pto.Categories.UpdateCategory }>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['Categories']
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `categories/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Categories']
    })
  })
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} = categoriesApi
