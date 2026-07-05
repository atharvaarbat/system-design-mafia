'use client'

import { createContext, useContext } from 'react'

export const EditableContext = createContext(true)

export const useEditable = () => useContext(EditableContext)
