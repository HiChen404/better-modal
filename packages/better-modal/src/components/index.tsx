/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ComponentType, FC, ReactNode } from 'react'
import { NiceModalArgs, NiceModalHandler, NiceModalHocProps } from '../types'
import { ALREADY_MOUNTED, MODAL_REGISTRY } from '../reducer'
import { getUid } from '../utils'
import { hide, register, show, unregister } from '../actions'
import { NiceModalContext, NiceModalIdContext } from '../context'
import { useModal } from '../hooks/useModal'

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
        <Comp {...(props as P)} {...args} />
      </NiceModalIdContext.Provider>
    )
  }
}
// The placeholder component is used to auto render modals when call modal.show()
// When modal.show() is called, it means there've been modal info
export const NiceModalPlaceholder: FC = () => {
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
