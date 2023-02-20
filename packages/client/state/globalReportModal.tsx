import React, { createContext, useContext, useState } from 'react'
import {
  TicketCreateModal,
  TicketCreateModalProps,
} from '@components/tournament/lobby/ticketCreation/ticketCreateModal'
import { FormValues } from '@components/tournament/lobby/ticketCreation/ticketCreateForm'
// Tutorial from https://opensource.com/article/21/5/global-modals-react
// Could be extended to use with other modals

interface GlobalReportModalProps extends TicketCreateModalProps {
  values: FormValues
}
interface GlobalModalContext {
  openModal: (tournamentId?: string) => void
  closeModal: () => void
  updateValues: (values: FormValues) => void
  resetForm: () => void
  store: GlobalReportModalProps
}

const initialState: GlobalModalContext = {
  openModal: () => {},
  closeModal: () => {},
  updateValues: () => {},
  resetForm: () => {},
  store: {
    open: false,
    values: { description: '', ticketType: null, player: null },
  },
}

const GlobalReportContext = createContext(initialState)
export const useGlobalReportContext = () => useContext(GlobalReportContext)

export const GlobalReportModal: React.FC = ({ children }) => {
  const [store, setStore] = useState<GlobalReportModalProps>(initialState.store)

  const openModal = (tournamentId?: string) => {
    setStore((store) => ({ ...store, open: true, tournamentId }))
  }

  const closeModal = () => {
    setStore((store) => ({ ...store, open: false }))
  }

  const updateValues = (values: FormValues) => {
    setStore((store) => ({ ...store, values }))
  }

  const resetForm = () => {
    setStore((store) => ({ ...store, values: initialState.store.values }))
  }

  return (
    <GlobalReportContext.Provider
      value={{ openModal, closeModal, updateValues, resetForm, store }}
    >
      {children}
      <TicketCreateModal
        tournamentId={store.tournamentId}
        open={store.open}
        onClose={() => closeModal()}
      />
    </GlobalReportContext.Provider>
  )
}
