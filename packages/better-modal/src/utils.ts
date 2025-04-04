const symModalId = Symbol('NiceModalId')
let uidSeed = 0
const getUid = () => `_nice_modal_${uidSeed++}`

export const getModalId = (modal: string | React.FC<any>): string => {
  if (typeof modal === 'string') return modal as string
  // @ts-ignore
  if (!modal?.[symModalId]) {
    // @ts-ignore
    modal[symModalId] = getUid()
  }
  // @ts-ignore
  return modal[symModalId]
}
