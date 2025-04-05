export const MODAL_REGISTRY: {
  [id: string]: {
    comp: React.FC<any>
    props?: Record<string, unknown>
  }
} = {}

export type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
  ? React.ComponentProps<T>
  : Record<string, unknown>

export const register = <T extends React.FC<any>>({
  modalId,
  comp,
}: {
  modalId: string
  comp: T
  props?: Partial<NiceModalArgs<T>>
}): void => {
  MODAL_REGISTRY[modalId] = {
    comp,
  }
}

export const unregister = ({ modalId }: { modalId: string }): void => {
  if (MODAL_REGISTRY[modalId]) {
    delete MODAL_REGISTRY[modalId]
  }
}
