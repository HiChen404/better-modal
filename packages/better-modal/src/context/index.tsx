/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

import React, { createContext, Dispatch, FC, ReactNode, useReducer, useContext } from 'react';
import { NiceModalAction, NiceModalStore } from '../types';
import { reducer } from '../reducer';

const initialState: NiceModalStore = {};

const DEFAULT_DISPATCH = () => {
  throw new Error('No dispatch method detected, did you embed your app with NiceModal.Provider?');
};

export const NiceModalContext = createContext<NiceModalStore>(initialState);
export const DispatchContext = createContext<Dispatch<NiceModalAction>>(DEFAULT_DISPATCH);
export const NiceModalIdContext = createContext<string | null>(null);

// Initialize the deprecated_dispatch variable
let deprecated_dispatch: Dispatch<NiceModalAction> = DEFAULT_DISPATCH;

const InnerContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, dispatch] = useReducer(reducer, initialState);
  const parentDispatch = useContext(DispatchContext);

  if (parentDispatch === DEFAULT_DISPATCH) {
    deprecated_dispatch = dispatch;
  }

  return (
    <NiceModalContext.Provider value={modals}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </NiceModalContext.Provider>
  );
};

export const Provider: FC<{
  children: ReactNode;
  modals?: NiceModalStore;
  dispatch?: Dispatch<NiceModalAction>;
  [key: string]: unknown;
}> = ({ children, dispatch: givenDispatch, modals: givenModals }) => {
  if (!givenDispatch || !givenModals) {
    return <InnerContextProvider>{children}</InnerContextProvider>;
  }

  deprecated_dispatch = givenDispatch;

  return (
    <NiceModalContext.Provider value={givenModals}>
      <DispatchContext.Provider value={givenDispatch}>
        {children}
      </DispatchContext.Provider>
    </NiceModalContext.Provider>
  );
};

export { deprecated_dispatch };
