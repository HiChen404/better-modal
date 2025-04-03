export const MODAL_REGISTRY: Record<
  string,
  Record<
    string,
    {
      comp: React.FC<any>
      visible?: boolean
      props?: Record<string, unknown>
    }
  >
> = {}
export type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
  ? React.ComponentProps<T>
  : Record<string, unknown>

export const register = <T extends React.FC<any>>({
  providerId,
  modalId,
  comp,
}: {
  providerId: string | number
  modalId: string
  comp: T
  props?: Partial<NiceModalArgs<T>>
}): void => {
  if (!MODAL_REGISTRY[providerId]) {
    MODAL_REGISTRY[providerId] = {}
  }
  MODAL_REGISTRY[providerId][modalId] = {
    comp,
    visible: true,
  }
}
