import { Pto } from 'rtxtypes'
import { apiSlice } from './api-slice'

export const nodesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNodes: builder.query<Pto.Nodes.NodeList, void>({
      query: () => ({
        url: 'nodes',
        method: 'GET'
      }),
      providesTags: ['Nodes']
    }),
    getShortNodes: builder.query<Pto.Nodes.ShortNodeList, void>({
      query: () => ({
        url: 'nodes/short',
        method: 'GET'
      }),
      providesTags: ['Nodes']
    }),
    getNode: builder.query<Pto.Nodes.Node, { id: string }>({
      query: ({ id }) => ({
        url: `nodes/${id}`,
        method: 'GET'
      }),
      providesTags: (_, __, { id }) => [{ type: 'Nodes', id }]
    }),
    createNode: builder.mutation<Pto.Nodes.Node, Pto.Nodes.CreateNode>({
      query: (createNodeDto) => ({
        url: 'nodes',
        method: 'POST',
        body: createNodeDto
      }),
      invalidatesTags: ['Nodes']
    }),
    updateNode: builder.mutation<Pto.Nodes.Node, { id: string; updateNodeDto: Pto.Nodes.UpdateNode }>({
      query: ({ id, updateNodeDto }) => ({
        url: `nodes/${id}`,
        method: 'PATCH',
        body: updateNodeDto
      }),
      invalidatesTags: ['Nodes']
    }),
    deleteNode: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `nodes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Nodes']
    })
  })
})

export const {
  useGetNodesQuery,
  useGetShortNodesQuery,
  useGetNodeQuery,
  useCreateNodeMutation,
  useUpdateNodeMutation,
  useDeleteNodeMutation
} = nodesApi
