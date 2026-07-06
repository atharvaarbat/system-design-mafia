'use client'

import { createContext, useContext } from 'react'

export const PortalTargetContext = createContext<HTMLElement | null>(null)

export const usePortalTarget = () => useContext(PortalTargetContext)
