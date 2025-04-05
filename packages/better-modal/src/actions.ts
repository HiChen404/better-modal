import { Dispatch, FC } from 'react'
import { NiceModalAction, NiceModalArgs, NiceModalCallbacks } from './types'
import { MODAL_REGISTRY } from './reducer'
import { getModalId } from './utils'

// Callbacks storage
export const modalCallbacks: NiceModalCallbacks = {}
export const hideModalCallbacks: NiceModalCallbacks = {}

// Get modal component by modal id
export function getModal(modalId: string): FC<any> | undefined {
  return MODAL_REGISTRY[modalId]?.comp
}

// action creator to show a modal
export function showModal(modalId: string, args?: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/show',
    payload: {
      modalId,
      args,
    },
  }
}

// action creator to set flags of a modal
export function setModalFlags(modalId: string, flags: Record<string, unknown>): NiceModalAction {
  return {
    type: 'nice-modal/set-flags',
    payload: {
      modalId,
      flags,
    },
  }
}

// action creator to hide a modal
export function hideModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/hide',
    payload: {
      modalId,
    },
  }
}

// action creator to remove a modal
export function removeModal(modalId: string): NiceModalAction {
  return {
    type: 'nice-modal/remove',
    payload: {
      modalId,
    },
  }
}

// External API for showing modals
export function show<T, C, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P,
  dispatch?: Dispatch<NiceModalAction>
): Promise<T>

export function show<T>(modal: string, args?: Record<string, unknown>, dispatch?: Dispatch<NiceModalAction>): Promise<T>
export function show<T, P>(modal: string, args: P, dispatch?: Dispatch<NiceModalAction>): Promise<T>

export function show(
  modal: FC<any> | string,
  args?: NiceModalArgs<FC<any>> | Record<string, unknown>,
  dispatch?: Dispatch<NiceModalAction>
) {
  const modalId = getModalId(modal)
  if (typeof modal !== 'string' && !MODAL_REGISTRY[modalId]) {
    register(modalId, modal as FC<any>)
  }

  // Import directly from ./context would create a circular dependency
  const actualDispatch =
    dispatch ||
    (window as any).__niceModal_deprecated_dispatch ||
    (() => {
      throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
    })

  actualDispatch(showModal(modalId, args))

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

// External API for hiding modals
export function hide<T>(modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>): Promise<T>
export function hide(modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>) {
  const modalId = getModalId(modal)

  // Import directly from ./context would create a circular dependency
  const actualDispatch =
    dispatch ||
    (window as any).__niceModal_deprecated_dispatch ||
    (() => {
      throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
    })

  actualDispatch(hideModal(modalId))

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

// External API for removing modals
export const remove = (modal: string | FC<any>, dispatch?: Dispatch<NiceModalAction>): void => {
  const modalId = getModalId(modal)

  // Import directly from ./context would create a circular dependency
  const actualDispatch =
    dispatch ||
    (window as any).__niceModal_deprecated_dispatch ||
    (() => {
      throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
    })

  actualDispatch(removeModal(modalId))
  delete modalCallbacks[modalId]
  delete hideModalCallbacks[modalId]
}

// Set modal flags
export const setFlags = (
  modalId: string,
  flags: Record<string, unknown>,
  dispatch?: Dispatch<NiceModalAction>
): void => {
  // Import directly from ./context would create a circular dependency
  const actualDispatch =
    dispatch ||
    (window as any).__niceModal_deprecated_dispatch ||
    (() => {
      throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?')
    })

  actualDispatch(setModalFlags(modalId, flags))
}

// Register a modal
export const register = <T extends FC<any>>(id: string, comp: T, props?: Partial<NiceModalArgs<T>>): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props }
  } else {
    MODAL_REGISTRY[id].props = props
  }
}

// Unregister a modal
export const unregister = (id: string): void => {
  delete MODAL_REGISTRY[id]
}
