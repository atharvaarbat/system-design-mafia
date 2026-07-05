'use client'

import { createContext, useContext } from 'react'

interface SelectionActions {
  groupSelectedNodes: (nodeIds: string[]) => void
  ungroupSelectedNodes: (nodeIds: string[]) => void
  moveNodesToGroup: (nodeIds: string[], targetGroupId: string) => void
}

export const SelectionActionsContext = createContext<SelectionActions>({
  groupSelectedNodes: () => {},
  ungroupSelectedNodes: () => {},
  moveNodesToGroup: () => {},
})

export const useSelectionActions = () => useContext(SelectionActionsContext)
