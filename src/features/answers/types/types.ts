export enum PaginationKeys {
  Search = 'searchText',
  Correct = 'correct',
  GroupIds = 'groupIds',
  NodeIds = 'nodeIds'
}

export type AnswersFilters = {
  searchText?: string
  correct?: boolean
  groupIds?: string[]
  nodeIds?: string[]
}
