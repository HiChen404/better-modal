import React, { PropsWithChildren, useContext, useReducer } from 'react'
import { NiceModalAction, NiceModalStore } from '../types'
import { ALREADY_MOUNTED, initialState, MODAL_REGISTRY } from '../modal'
import { reducer } from '../utils'

export const NiceModalContext = React.createContext<NiceModalStore>({})

export let dispatch: React.Dispatch<NiceModalAction> = () => {
  throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
}
const NiceModalPlaceholder: React.FC = () => {
  const modals = useContext(NiceModalContext)
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id])
  visibleModalIds.forEach((id) => {
    if (!MODAL_REGISTRY[id] && !ALREADY_MOUNTED[id]) {
      console.warn(`No modal found for id: ${id}. Please check the id or if it is registered or declared via JSX.`)
      return
    }
  })

  const toRender = visibleModalIds
    .filter((id) => MODAL_REGISTRY[id])
    .map((id) => ({
      id,
      ...MODAL_REGISTRY[id],
    }))

  return (
    <>
      {toRender.map((t) => (
        <t.comp key={t.id} id={t.id} {...t.props} />
      ))}
    </>
  )
}

export const InnerContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const arr = useReducer(reducer, initialState)
  const modals = arr[0]
  dispatch = arr[1]
  return (
    <NiceModalContext.Provider value={modals}>
      {children}
      <NiceModalPlaceholder />
    </NiceModalContext.Provider>
  )
}

export const Provider: React.FC<
  PropsWithChildren<{
    dispatch?: React.Dispatch<NiceModalAction>
    modals?: NiceModalStore
  }>
> = ({ children, dispatch: givenDispatch, modals: givenModals }) => {
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider>{children}</InnerContextProvider>
  }
  dispatch = givenDispatch
  return (
    <NiceModalContext.Provider value={givenModals}>
      {children}
      <NiceModalPlaceholder />
    </NiceModalContext.Provider>
  )
}
