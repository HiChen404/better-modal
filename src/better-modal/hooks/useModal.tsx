import { useContext, useEffect } from 'react'
import { NiceModalIdContext } from '../contexts/id-context'
import { dispatch, NiceModalContext } from '../contexts/modal-context'
import { MODAL_REGISTRY, register, remove } from '../modal'
import { NiceModalArgs, NiceModalHandler } from '../types'
import { getModalId, showModal } from '../utils'

export function useModal(): NiceModalHandler
export function useModal(modal: string, args?: Record<string, unknown>): NiceModalHandler
export function useModal<C extends any, P extends Partial<NiceModalArgs<React.FC<C>>>>(
  modal: React.FC<C>,
  args?: P,
): Omit<NiceModalHandler, 'show'> & {
  show: (args?: P) => Promise<unknown>
}

export function useModal(modal?: any, args?: any): any {
  const modals = useContext(NiceModalContext)
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

  useEffect(() => {
    if (isUseComponent && !MODAL_REGISTRY[mid]) {
      register(mid, modal as React.FC, args)
    }
  }, [isUseComponent, mid, modal, args])

  const modalInfo = modals[mid]

  const showCallback = () => {
    dispatch(showModal(mid))
  }
  const removeCallback = () => {
    remove(mid)
  }
  const hideCallback = () => {
    // hide
  }

  return {
    id: mid,
    visible: modalInfo?.visible || false,
    show: showCallback,
    remove: removeCallback,
    hide: hideCallback,
  }
}
