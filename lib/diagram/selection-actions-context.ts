'use client'

import { createContext, useContext } from 'react'

interface SelectionActions {
  groupSelectedNodes: (nodeIds: string[]) => void
}

export const SelectionActionsContext = createContext<SelectionActions>({
  groupSelectedNodes: () => {},
})

export const useSelectionActions = () => useContext(SelectionActionsContext)
