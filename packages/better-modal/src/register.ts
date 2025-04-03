export const MODAL_REGISTRY: {
  [id: string]: {
    comp: React.FC<any>
    props?: Record<string, unknown>
  }
} = {}
export const ALREADY_MOUNTED = {}
export type NiceModalArgs<T> = T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
  ? React.ComponentProps<T>
  : Record<string, unknown>

// All registered modals will be rendered in modal placeholder
export const register = <T extends React.FC<any>>(id: string, comp: T, props?: Partial<NiceModalArgs<T>>): void => {
  if (!MODAL_REGISTRY[id]) {
    MODAL_REGISTRY[id] = { comp, props }
  } else {
    MODAL_REGISTRY[id].props = props
  }
}
