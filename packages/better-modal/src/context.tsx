import { createStore, create } from 'zustand'
import { createContext, Dispatch, FC, ReactNode, useContext, useReducer } from 'react'
import { NiceModalStore, NiceModalAction } from './types'
import { MODAL_REGISTRY } from '.'
import { ALREADY_MOUNTED } from '.'
import { getRandomId } from './utils'
import { reducer } from './reducer'

export let all_dispatch: Record<string, Dispatch<NiceModalAction>> = {}

export const initialState: NiceModalStore = {}
export const DEFAULT_DISPATCH = () => {
  throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
}

export const NiceModalContext = createContext<NiceModalStore>(initialState)
export const DispatchContext = createContext<Dispatch<NiceModalAction>>(DEFAULT_DISPATCH)
export const ProviderIdContext = createContext<string | null>(null)
export const NiceModalIdContext = createContext<string | null>(null)

export const ZNiceModal = createStore<NiceModalStore>((set) => ({
  ...initialState,
}))

// The placeholder component is used to auto render modals when call modal.show()
// When modal.show() is called, it means there've been modal info
const NiceModalPlaceholder: FC = () => {
  const modals = useContext(NiceModalContext)
  const visibleModalIds = Object.keys(modals).filter((id) => !!modals[id])
  // biome-ignore lint/complexity/noForEach: <explanation>
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

const InnerContextProvider: FC<{ children: ReactNode; providerId: string }> = ({ children, providerId }) => {
  const [modals, dispatch] = useReducer(reducer, initialState)
  const parentDispatch = useContext(DispatchContext)

  if (parentDispatch === DEFAULT_DISPATCH) {
    all_dispatch = { default: dispatch }
  }

  if (all_dispatch['default']) {
    all_dispatch[providerId] = dispatch
  }

  return (
    <ProviderIdContext.Provider value={providerId}>
      <NiceModalContext.Provider value={modals}>
        <DispatchContext.Provider value={dispatch}>
          {children}
          <NiceModalPlaceholder />
        </DispatchContext.Provider>
      </NiceModalContext.Provider>
    </ProviderIdContext.Provider>
  )
}

export const Provider: FC<{
  children: ReactNode
  modals?: NiceModalStore
  dispatch?: Dispatch<NiceModalAction>
  providerId?: string
}> = ({ children, dispatch: givenDispatch, modals: givenModals, providerId = getRandomId() }) => {
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider providerId={providerId}>{children}</InnerContextProvider>
  }

  return (
    <ProviderIdContext.Provider value={providerId}>
      <NiceModalContext.Provider value={givenModals}>
        <DispatchContext.Provider value={givenDispatch}>
          {children}
          <NiceModalPlaceholder />
        </DispatchContext.Provider>
      </NiceModalContext.Provider>
    </ProviderIdContext.Provider>
  )
}
