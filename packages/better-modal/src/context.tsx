import { createContext, Dispatch, FC, PropsWithChildren, useContext, useMemo, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ALREADY_MOUNTED, MODAL_REGISTRY } from '.'
import { reducer } from './reducer'
import { NiceModalAction, NiceModalStore } from './types'
import { getRandomId } from './utils'

export const DEFAULT_DISPATCH = () => {
  throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
}

// biome-ignore lint/style/useConst: <explanation>
export let all_dispatch: Record<string, Dispatch<NiceModalAction>> = {}

export const initialState: NiceModalStore = {}

export const NiceModalIdContext = createContext<string | null>(null)

interface BearProps {
  isTopLevel: boolean
  providerId: string
  modals: NiceModalStore
  modalId?: string
}

export interface BearState extends BearProps {
  dispatch: Dispatch<NiceModalAction>
}

const createBearStore = (initProps?: Partial<BearState>) => {
  const DEFAULT_PROPS: BearProps = {
    isTopLevel: false,
    providerId: getRandomId(),
    modals: initialState,
  }
  return createStore<BearState>()(
    devtools(
      (set) => ({
        ...DEFAULT_PROPS,
        ...initProps,
        dispatch: (args) => {
          set((state) => ({ modals: reducer(state['modals'], args) }))
        },
      }),
      { enabled: true, name: 'BearStore' }
    )
  )
}

type BearStore = ReturnType<typeof createBearStore>

type BearProviderProps = React.PropsWithChildren<Partial<BearState>>

export const BearContext = createContext<BearStore | null>(null)

function BearProvider({ children, ...props }: BearProviderProps) {
  const storeRef = useRef<BearStore>()
  if (!storeRef.current) {
    storeRef.current = createBearStore(props)
  }
  if (storeRef.current.getState().providerId !== props.providerId) {
    storeRef.current = createBearStore(props)
  }

  return <BearContext.Provider value={storeRef.current}>{children}</BearContext.Provider>
}

export function useBearContext<T>(selector: (state: BearState) => T): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector)
}
export function useSafeBearContext<T>(selector: (state: BearState) => T): T | undefined {
  const store = useContext(BearContext)
  if (!store) return undefined
  return useStore(store, selector)
}

const NiceModalPlaceholder: FC = () => {
  const modals = useBearContext((s) => s.modals)
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

const useInitDispatch = () => {
  const parentDispatch = useSafeBearContext((s) => s.dispatch)
  const isTopLevel = !parentDispatch

  if (isTopLevel) {
    all_dispatch = { default: DEFAULT_DISPATCH }
  }
  return { isTopLevel }
}

const DistributeDispatch = ({ isTopLevel, providerId }: { isTopLevel: boolean; providerId: string }) => {
  const dispatch = useBearContext((s) => s.dispatch)

  if (isTopLevel) {
    all_dispatch['default'] = dispatch
  }

  all_dispatch[providerId] = dispatch

  return null
}

export const Provider: FC<PropsWithChildren<Partial<Omit<BearState, 'isTopLevel'>>>> = ({
  children,
  providerId,
  ...props
}) => {
  const { isTopLevel } = useInitDispatch()
  const resolvedProviderId = useMemo(() => providerId || getRandomId(), [providerId])

  return (
    <BearProvider isTopLevel={isTopLevel} providerId={resolvedProviderId} {...props}>
      {children}
      <DistributeDispatch isTopLevel={isTopLevel} providerId={resolvedProviderId} />
      <NiceModalPlaceholder />
    </BearProvider>
  )
}
