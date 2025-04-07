import { ComponentType, FC, useCallback, useContext, useEffect, useMemo } from 'react'
import { antdDrawer, antdModal, bootstrapDialog, muiDialog } from './adapters'
import {
  NiceModalContext,
  NiceModalIdContext,
  Provider,
  ProviderIdContext,
  all_dispatch
} from './context'
import { hideModal, reducer, removeModal, setModalFlags, showModal } from './reducer'

import {
  ModalRegistry,
  NiceModalArgs,
  NiceModalCallbacks,
  NiceModalHandler,
  NiceModalHocProps
} from './types'
import { createPromise, getModalId, getUid } from './utils'

const symModalId = Symbol('NiceModalId')

declare module 'react' {
  interface FunctionComponent {
    [symModalId]?: string
  }
}

export const MODAL_REGISTRY: ModalRegistry = {}

export const ALREADY_MOUNTED: Record<string, boolean> = {}

// Get modal component by modal id
function getModal(modalId: string) {
  return MODAL_REGISTRY[modalId]?.comp
}

const modalCallbacks: NiceModalCallbacks = {}
const hideModalCallbacks: NiceModalCallbacks = {}

export function show<T, C, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P,
  providerId?: string
): Promise<T>

export function show<T>(modal: string, args?: Record<string, unknown>, providerId?: string): Promise<T>
export function show<T, P>(modal: string, args: P, providerId?: string): Promise<T>

export function show(modal: FC | string, args?: NiceModalArgs<FC> | Record<string, unknown>, providerId?: string) {
  const modalId = getModalId(modal)
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as FC)
  }
  const dispatch = providerId ? all_dispatch[providerId] : all_dispatch['default']
  dispatch(showModal(modalId, args))
  if (!modalCallbacks[modalId]) {
    const { promise, resolve, reject } = createPromise()
    modalCallbacks[modalId] = {
      resolve: resolve,
      reject: reject,
      promise,
    }
  }
  return modalCallbacks[modalId].promise
}

export function hide<T>(modal: string | FC, providerId?: string): Promise<T>
export function hide(modal: string | FC, providerId?: string) {
  const modalId = getModalId(modal)
  const dispatch = providerId ? all_dispatch[providerId] : all_dispatch['default']
  dispatch(hideModal(modalId))
  delete modalCallbacks[modalId]
  if (!hideModalCallbacks[modalId]) {
    const { promise, resolve, reject } = createPromise()
    hideModalCallbacks[modalId] = {
      resolve: resolve,
      reject: reject,
      promise,
    }
  }
  return hideModalCallbacks[modalId].promise
}

export const remove = (modal: string | FC, providerId?: string): void => {
  const modalId = getModalId(modal)
  const dispatch = providerId ? all_dispatch[providerId] : all_dispatch['default']
  dispatch(removeModal(modalId))
  delete modalCallbacks[modalId]
  delete hideModalCallbacks[modalId]
}

const setFlags = (modalId: string, flags: Record<string, unknown>, providerId?: string): void => {
  const dispatch = providerId ? all_dispatch[providerId] : all_dispatch['default']
  dispatch(setModalFlags(modalId, flags))
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
  const contextModalId = useContext(NiceModalIdContext)
  const providerId = useContext(ProviderIdContext)
  let modalId: string | null = null
  const isUseComponent = modal && typeof modal !== 'string'
  if (!modal) {
    modalId = contextModalId
  } else {
    modalId = getModalId(modal)
  }

  if (!providerId) throw new Error('No Provider id found in NiceModal.useModal')

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

  const showCallback = useCallback((args?: Record<string, unknown>) => show(mid, args, providerId), [mid, providerId])
  const hideCallback = useCallback(() => hide(mid, providerId), [mid, providerId])
  const removeCallback = useCallback(() => remove(mid, providerId), [mid, providerId])
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
export const register = <T extends FC>(id: string, comp: T, props?: Partial<NiceModalArgs<T>>): void => {
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

/**
 * Declarative way to register a modal.
 * @param id - The id of the modal.
 * @param component - The modal Component.
 * @returns
 */
export const ModalDef: FC<{
  id: string
  component: FC
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
  modal: string | FC
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
  handler.show = useCallback((args: unknown) => show(mid, args), [mid])
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
