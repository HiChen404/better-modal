/* *********************************************************
 * Copyright 2021 eBay Inc.

 * Use of this source code is governed by an MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
*********************************************************** */

import { NiceModalHandler } from '../types';

// Ant Design Modal (v4) adapter
export const antdModal = (
  modal: NiceModalHandler
): { visible: boolean; onCancel: () => void; onOk: () => void; afterClose: () => void } => {
  return {
    visible: modal.visible,
    onOk: () => modal.hide(),
    onCancel: () => modal.hide(),
    afterClose: () => {
      // Need to resolve before remove
      modal.resolveHide();
      if (!modal.keepMounted) modal.remove();
    },
  };
};

// Ant Design Modal (v5) adapter
export const antdModalV5 = (
  modal: NiceModalHandler
): { open: boolean; onCancel: () => void; onOk: () => void; afterClose: () => void } => {
  const { onOk, onCancel, afterClose } = antdModal(modal);
  return {
    open: modal.visible,
    onOk,
    onCancel,
    afterClose,
  };
};

// Ant Design Drawer (v4) adapter
export const antdDrawer = (
  modal: NiceModalHandler
): { visible: boolean; onClose: () => void; afterVisibleChange: (visible: boolean) => void } => {
  return {
    visible: modal.visible,
    onClose: () => modal.hide(),
    afterVisibleChange: (v: boolean) => {
      if (!v) {
        modal.resolveHide();
      }
      !v && !modal.keepMounted && modal.remove();
    },
  };
};

// Ant Design Drawer (v5) adapter
export const antdDrawerV5 = (
  modal: NiceModalHandler
): { open: boolean; onClose: () => void; afterOpenChange: (visible: boolean) => void } => {
  const { onClose, afterVisibleChange: afterOpenChange } = antdDrawer(modal);
  return {
    open: modal.visible,
    onClose,
    afterOpenChange,
  };
};

// Material UI Dialog adapter
export const muiDialog = (modal: NiceModalHandler): { open: boolean; onClose: () => void; onExited: () => void } => {
  return {
    open: modal.visible,
    onClose: () => modal.hide(),
    onExited: () => {
      modal.resolveHide();
      !modal.keepMounted && modal.remove();
    },
  };
};

// Material UI Dialog (v5) adapter
export const muiDialogV5 = (
  modal: NiceModalHandler
): { open: boolean; onClose: () => void; TransitionProps: { onExited: () => void } } => {
  return {
    open: modal.visible,
    onClose: () => modal.hide(),
    TransitionProps: {
      onExited: () => {
        modal.resolveHide();
        !modal.keepMounted && modal.remove();
      },
    },
  };
};

// Bootstrap Dialog adapter
export const bootstrapDialog = (
  modal: NiceModalHandler
): { show: boolean; onHide: () => void; onExited: () => void } => {
  return {
    show: modal.visible,
    onHide: () => modal.hide(),
    onExited: () => {
      modal.resolveHide();
      !modal.keepMounted && modal.remove();
    },
  };
};
