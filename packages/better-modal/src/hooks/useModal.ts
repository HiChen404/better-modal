import { useCallback, useContext, useEffect, useMemo } from 'react'
import { FC } from 'react'
import { NiceModalArgs, NiceModalHandler } from '../types'
import { getModalId } from '../utils'
import { hide, modalCallbacks, register, remove, show } from '../actions'
import { DispatchContext, NiceModalContext, NiceModalIdContext } from '../context'
import { MODAL_REGISTRY } from '../reducer'

export function useModal(): NiceModalHandler
export function useModal(modal: string, args?: Record<string, unknown>): NiceModalHandler
export function useModal<C extends any, P extends Partial<NiceModalArgs<FC<C>>>>(
  modal: FC<C>,
  args?: P
): Omit<NiceModalHandler, 'show'> & {
  show: (args?: P) => Promise<unknown>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useModal(modal?: any, args?: any): any {
  const modals = useContext(NiceModalContext)
  const dispatch = useContext(DispatchContext)
  const contextModalId = useContext(NiceModalIdContext)
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

  const showCallback = useCallback((args?: Record<string, unknown>) => show(mid, args, dispatch), [mid])
  const hideCallback = useCallback(() => hide(mid, dispatch), [mid])
  const removeCallback = useCallback(() => remove(mid, dispatch), [mid])
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
