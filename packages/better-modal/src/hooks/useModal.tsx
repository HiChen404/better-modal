import { useContext, useEffect } from 'react'
import { NiceModalContext, NiceModalIdContext } from '../context'
import { getModalId } from '../utils'
import { MODAL_REGISTRY, register } from '../register'
import { show } from '../show'

export function useModal(modal?: any, args?: any): any {
  const modals = useContext(NiceModalContext)
  console.log('🚀 -> useModal -> modals:', modals)
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
      register(mid, modal as React.FC, args)
    }
  }, [isUseComponent, mid, modal, args])

  const showCallback = (args?: Record<string, unknown>) => show(mid, args)

  return {
    show: showCallback,
  }
}
