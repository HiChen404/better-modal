export interface NiceModalState {
  id: string
  args?: Record<string, unknown>
  visible?: boolean
}

export interface NiceModalStore {
  [key: string]: NiceModalState
}

export interface NiceModalHocProps {
  id: string
}

export interface NiceModalHandler<Props = Record<string, unknown>> extends NiceModalState {
  visible: boolean

  show: (args?: Props) => Promise<unknown>

  hide: () => Promise<unknown>

  remove: () => void
}

export type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any> ? React.ComponentProps<T> : Record<string, unknown>

export interface NiceModalAction {
  type: string
  payload: {
    modalId: string
    args?: Record<string, unknown>
  }
}
