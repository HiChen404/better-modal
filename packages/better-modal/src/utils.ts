const symModalId = Symbol('NiceModalId')

declare module 'react' {
  interface FunctionComponent {
    [symModalId]?: string
  }
}

let uidSeed = 0

export const getUid = () => `_nice_modal_${uidSeed++}`

export const getModalId = (modal: string | React.FC): string => {
  if (typeof modal === 'string') return modal as string
  if (!modal?.[symModalId]) {
    modal[symModalId] = getUid()
  }
  return modal[symModalId]
}

export const createPromise = <T = unknown>() => {
  let _resolve!: (value: T | PromiseLike<T>) => void
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let _reject!: (reason?: any) => void

  const promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  return {
    promise,
    resolve: _resolve,
    reject: _reject,
  }
}
