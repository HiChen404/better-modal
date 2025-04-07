import {
  ComponentProps,
  ComponentType,
  Dispatch,
  FC,
  JSXElementConstructor,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { antdDrawer, antdModal, bootstrapDialog, muiDialog } from './adapters'
import { DispatchContext, NiceModalContext, NiceModalIdContext, ProviderIdContext } from './context'
import { DEFAULT_DISPATCH, hideModal, initialState, reducer, removeModal, setModalFlags, showModal } from './reducer'
import { NiceModalAction, NiceModalCallbacks, NiceModalHandler, NiceModalHocProps, NiceModalStore } from './types'

const symModalId = Symbol('NiceModalId')

declare module 'react' {
  interface FunctionComponent {
    [symModalId]?: string
  }
}

const MODAL_REGISTRY: {
  [id: string]: {
    comp: FC<any>
    props?: Record<string, unknown>
  }
} = {}
export const ALREADY_MOUNTED: Record<string, boolean> = {}
export const getUid = () => `_nice_modal_${uidSeed++}`
let uidSeed = 0
/**
 * @deprecated We will deprecate this API because it encounters reference errors in nested provider scenarios.
 * @see useModal()
 */
let deprecated_dispatch: Record<string, Dispatch<NiceModalAction>> = {}

// Get modal component by modal id
function getModal(modalId: string): FC<any> | undefined {
  return MODAL_REGISTRY[modalId]?.comp
}

const modalCallbacks: NiceModalCallbacks = {}
const hideModalCallbacks: NiceModalCallbacks = {}
const getModalId = (modal: string | FC<any>): string => {
  if (typeof modal === 'string') return modal as string
  if (!modal[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]
}

type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
  ? ComponentProps<T>
  : Record<string, unknown>

export function show<T, C, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P,
  // dispatch?: Dispatch<NiceModalAction>
  providerId?: string
): Promise<T>

export function show<T>(modal: string, args?: Record<string, unknown>, providerId?: string): Promise<T>
export function show<T, P>(modal: string, args: P, providerId?: string): Promise<T>

export function show(
  modal: FC<any> | string,
  args?: NiceModalArgs<FC<any>> | Record<string, unknown>,
  providerId?: string
) {
  const modalId = getModalId(modal)
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as FC)
  }
  const dispatch = providerId ? deprecated_dispatch[providerId] : deprecated_dispatch['default']
  dispatch(showModal(modalId, args))
  if (!modalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve
      theReject = reject
    })
    modalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    }
  }
  return modalCallbacks[modalId].promise
}

export function hide<T>(modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>): Promise<T>
export function hide(modal: string | FC<any>, providerId?: string) {
  const modalId = getModalId(modal)
  const dispatch = providerId ? deprecated_dispatch[providerId] : deprecated_dispatch['default']
  dispatch(hideModal(modalId))
  // Should also delete the callback for modal.resolve #35
  delete modalCallbacks[modalId]
  if (!hideModalCallbacks[modalId]) {
    // `!` tell ts that theResolve will be written before it is used
    let theResolve!: (args?: unknown) => void
    // `!` tell ts that theResolve will be written before it is used
    let theReject!: (args?: unknown) => void
    const promise = new Promise((resolve, reject) => {
      theResolve = resolve
      theReject = reject
    })
    hideModalCallbacks[modalId] = {
      resolve: theResolve,
      reject: theReject,
      promise,
    }
  }
  return hideModalCallbacks[modalId].promise
}

export const remove = (modal: string | FC<any>, providerId?: string): void => {
  const modalId = getModalId(modal)
  ;(providerId ? deprecated_dispatch[providerId] : deprecated_dispatch['default'])(removeModal(modalId))
  delete modalCallbacks[modalId]
  delete hideModalCallbacks[modalId]
}

const setFlags = (modalId: string, flags: Record<string, unknown>): void => {
  deprecated_dispatch(setModalFlags(modalId, flags))
}
export function useModal(): NiceModalHandler
export function useModal(modal: string, args?: Record<string, unknown>): NiceModalHandler
export function useModal<C, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P
): Omit<NiceModalHandler, 'show'> & {
  show: (args?: P) => Promise<unknown>
}

export function useModal(modal?: any, args?: any): any {
  const modals = useContext(NiceModalContext)
  const dispatch = useContext(DispatchContext)
  const contextModalId = useContext(NiceModalIdContext)
  const providerId = useContext(ProviderIdContext)
  let modalId: string | null = null
  const isUseComponent = modal && typeof modal !== 'string'
  if (!modal) {
    modalId = contextModalId
  } else {
    modalId = getModalId(modal)
  }

  // Only if contextModalId doesn't exist
  if (!modalId) throw new Error('No modal id found in NiceModal.useModal.')

  const mid = modalId as string
  // If use a component directly, register it.
  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY[mid]) {
      register(mid, modal as FC, args)
    }
  }, [isUseComponent, mid, modal, args])

  const modalInfo = modals[mid]

  const showCallback = useCallback((args?: Record<string, unknown>) => show(mid, args, providerId), [mid])
  const hideCallback = useCallback(() => hide(mid, providerId), [mid])
  const removeCallback = useCallback(() => remove(mid, providerId), [mid])
  const resolveCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.resolve(args)
      delete modalCallbacks[mid]
    },
    [mid]
  )
  const rejectCallback = useCallback(
    (args?: unknown) => {
      modalCallbacks[mid]?.reject(args)
      delete modalCallbacks[mid]
    },
    [mid]
  )
  const resolveHide = useCallback(
    (args?: unknown) => {
      hideModalCallbacks[mid]?.resolve(args)
      delete hideModalCallbacks[mid]
    },
    [mid]
  )

  return useMemo(
    () => ({
      id: mid,
      args: modalInfo?.args,
      visible: !!modalInfo?.visible,
      keepMounted: !!modalInfo?.keepMounted,
      show: showCallback,
      hide: hideCallback,
      remove: removeCallback,
      resolve: resolveCallback,
      reject: rejectCallback,
      resolveHide,
    }),
    [
      mid,
      modalInfo?.args,
      modalInfo?.visible,
      modalInfo?.keepMounted,
      showCallback,
      hideCallback,
      removeCallback,
      resolveCallback,
      rejectCallback,
      resolveHide,
    ]
  )
}
export const create = <P extends {}>(Comp: ComponentType<P>): FC<P & NiceModalHocProps> => {
  return ({ defaultVisible, keepMounted, id, ...props }) => {
    const { args, show } = useModal(id)

    // If there's modal state, then should mount it.
    const modals = useContext(NiceModalContext)
    const shouldMount = !!modals[id]

    useEffect(() => {
      // If defaultVisible, show it after mounted.
      if (defaultVisible) {
        show()
      }

      ALREADY_MOUNTED[id] = true

      return () => {
        delete ALREADY_MOUNTED[id]
      }
    }, [id, show, defaultVisible])

    useEffect(() => {
      if (keepMounted) setFlags(id, { keepMounted: true })
    }, [id, keepMounted])

    const delayVisible = modals[id]?.delayVisible
    // If modal.show is called
    //  1. If modal was mounted, should make it visible directly
    //  2. If modal has not been mounted, should mount it first, then make it visible
    useEffect(() => {
      if (delayVisible) {
        // delayVisible: false => true, it means the modal.show() is called, should show it.
        show(args)
      }
    }, [delayVisible, args, show])

    if (!shouldMount) return null
    return (
      <NiceModalIdContext.Provider value={id}>
        <Comp {...(props as unknown as P)} {...args} />
      </NiceModalIdContext.Provider>
    )
  }
}

// All registered modals will be rendered in modal placeholder
export const register = <T extends FC<any>>(id: string, comp: T, props?: Partial<NiceModalArgs<T>>): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props }
  } else {
    MODAL_REGISTRY[id].props = props
  }
}

/**
 * Unregister a modal.
 * @param id - The id of the modal.
 */
export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id]
}

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
    deprecated_dispatch = { default: dispatch }
  }

  if (deprecated_dispatch['default']) {
    deprecated_dispatch[providerId] = dispatch
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

const getRandomId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const Provider: FC<{
  children: ReactNode
  modals?: NiceModalStore
  dispatch?: Dispatch<NiceModalAction>
  providerId?: string
}> = ({ children, dispatch: givenDispatch, modals: givenModals, providerId = getRandomId() }) => {
  const parentDispatch = useContext(DispatchContext)
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider providerId={providerId}>{children}</InnerContextProvider>
  }

  // if (parentDispatch === DEFAULT_DISPATCH) {
  //   deprecated_dispatch = givenDispatch
  // }

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

/**
 * Declarative way to register a modal.
 * @param id - The id of the modal.
 * @param component - The modal Component.
 * @returns
 */
export const ModalDef: FC<{
  id: string
  component: FC<any>
}> = ({ id, component }) => {
  useEffect(() => {
    register(id, component)
    return () => {
      unregister(id)
    }
  }, [id, component])
  return null
}

/**
 * A place holder allows to bind props to a modal.
 * It assigns show/hide methods to handler object to show/hide the modal.
 *
 * Comparing to use the <MyNiceModal id=../> directly, this approach allows use registered modal id to find the modal component.
 * Also it avoids to create unique id for MyNiceModal.
 *
 * @param modal - The modal id registered or a modal component.
 * @param handler - The handler object to control the modal.
 * @returns
 */
export const ModalHolder: FC<{
  modal: string | FC<any>
  handler: any
  [key: string]: unknown
}> = ({ modal, handler = {}, ...restProps }) => {
  const mid = useMemo(() => getUid(), [])
  const ModalComp = typeof modal === 'string' ? MODAL_REGISTRY[modal]?.comp : modal

  if (!handler) {
    throw new Error('No handler found in NiceModal.ModalHolder.')
  }
  if (!ModalComp) {
    throw new Error(`No modal found for id: ${modal} in NiceModal.ModalHolder.`)
  }
  handler.show = useCallback((args: any) => show(mid, args), [mid])
  handler.hide = useCallback(() => hide(mid), [mid])

  return <ModalComp id={mid} {...restProps} />
}

const NiceModal = {
  Provider,
  ModalDef,
  ModalHolder,
  NiceModalContext,
  create,
  register,
  getModal,
  show,
  hide,
  remove,
  useModal,
  reducer,
  antdModal,
  antdDrawer,
  muiDialog,
  bootstrapDialog,
}

export default NiceModal
