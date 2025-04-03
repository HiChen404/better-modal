import React, { FC, useContext, useEffect } from 'react'
import NiceModal from '.'
import { NiceModalContext, NiceModalIdContext } from './context'
import { useModal } from './hooks/useModal'
import { ALREADY_MOUNTED } from './register'

export interface NiceModalHocProps {
  id: string
  defaultVisible?: boolean
  keepMounted?: boolean
}

export const create = <P extends {}>(Comp: React.ComponentType<P>): React.FC<P & NiceModalHocProps> => {
  return ({ defaultVisible, keepMounted, id, ...props }) => {
    const { args, show } = useModal(id)
    const modals = useContext(NiceModalContext)
    const shouldMount = !!modals[id]

    useEffect(() => {
      if (defaultVisible) {
        show()
      }

      // @ts-ignore
      ALREADY_MOUNTED[id] = true

      return () => {
        // @ts-ignore
        delete ALREADY_MOUNTED[id]
      }
    }, [id, show, defaultVisible])
    return (
      <NiceModalIdContext.Provider value={id}>
        <Comp {...(props as unknown as P)} />
      </NiceModalIdContext.Provider>
    )
  }
}
