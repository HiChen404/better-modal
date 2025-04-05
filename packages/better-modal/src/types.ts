/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, ComponentType, Dispatch, FC, JSXElementConstructor } from 'react';

export interface NiceModalState {
  id: string
  args?: Record<string, unknown>
  visible?: boolean
  delayVisible?: boolean
  keepMounted?: boolean
}

export interface NiceModalStore {
  [key: string]: NiceModalState
}

export interface NiceModalAction {
  type: string
  payload: {
    modalId: string
    args?: Record<string, unknown>
    flags?: Record<string, unknown>
  }
}

export interface NiceModalCallbacks {
  [modalId: string]: {
    resolve: (args: unknown) => void
    reject: (args: unknown) => void
    promise: Promise<unknown>
  }
}

/**
 * The handler to manage a modal returned by {@link useModal | useModal} hook.
 */
export interface NiceModalHandler<Props = Record<string, unknown>> extends NiceModalState {
  /**
   * Whether a modal is visible, it's controlled by {@link NiceModalHandler.show | show}/{@link NiceModalHandler.hide | hide} method.
   */
  visible: boolean
  /**
   * If you don't want to remove the modal from the tree after hide when using helpers, set it to true.
   */
  keepMounted: boolean
  /**
   * Show the modal, it will change {@link NiceModalHandler.visible | visible} state to true.
   * @param args - an object passed to modal component as props.
   */
  show: (args?: Props) => Promise<unknown>
  /**
   * Hide the modal, it will change {@link NiceModalHandler.visible | visible} state to false.
   */
  hide: () => Promise<unknown>
  /**
   * Resolve the promise returned by {@link NiceModalHandler.show | show} method.
   */
  resolve: (args?: unknown) => void
  /**
   * Reject the promise returned by {@link NiceModalHandler.show | show} method.
   */
  reject: (args?: unknown) => void
  /**
   * Remove the modal component from React component tree. It improves performance compared to just making a modal invisible.
   */
  remove: () => void

  /**
   * Resolve the promise returned by {@link NiceModalHandler.hide | hide} method.
   */
  resolveHide: (args?: unknown) => void
}

// Omit will not work if extends Record<string, unknown>, which is not needed here
export interface NiceModalHocProps {
  id: string
  defaultVisible?: boolean
  keepMounted?: boolean
}

export type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
  ? ComponentProps<T>
  : Record<string, unknown>

export interface ModalRegistry {
  [id: string]: {
    comp: FC<any>
    props?: Record<string, unknown>
  }
}

export interface AlreadyMounted {
  [id: string]: boolean
}
