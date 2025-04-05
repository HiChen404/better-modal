const symModalId = Symbol('NiceModalId')

declare module 'react' {
  interface FunctionComponent {
    [symModalId]?: string
  }
}

let uidSeed = 0

export const getUid = () => `_nice_modal_${uidSeed++}`

export const getModalId = (modal: string | React.FC<any>): string => {
  if (typeof modal === 'string') return modal as string
  if (!modal?.[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]
}
