import { Provider } from './contexts/modal-context'
import { useModal } from './hooks/useModal'
import { create, register } from './modal'
import { reducer } from './utils'

const NiceModal = { Provider, create, register, reducer, useModal }

export default NiceModal


