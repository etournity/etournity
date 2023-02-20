import React, { ReactNode, useLayoutEffect, useState } from 'react'

import styles from './index.module.scss'
import { Header } from './header/header'
import { Footer } from './footer/footer'
import { useWindowSize } from '@hooks/useWindowSize'
import { useChatRooms } from '@hooks/useChatRooms'
import { useAuth } from '@hooks/useAuth'
import { Savestates, SaveNavItem } from './savestates'
import {
  useCreateSavestateMutation,
  useGetSavestatesQuery,
  useRestoreSavestateMutation,
  useDeleteSavestateMutation,
} from '@generated/graphql'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { Modal } from '@components/ui/modal'
import { Input } from '@components/ui/input'
import { reportRouteChange } from '@utils/reportRouteChange'
import { BottomNav } from './bottomNav'
import { NavContext, getActivePath } from '@utils/navContext'
import Box from '@mui/material/Box'
import { GlobalReportModal } from '@state/globalReportModal'

export interface AppLayoutProps {
  children: ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const user = useAuth()?.user
  const router = useRouter()
  const [navPath, setNavPath] = useState(getActivePath(router))
  const { isMobile } = useWindowSize()
  const { chatOpen } = useChatRooms()
  const { data, refetch } = useGetSavestatesQuery({
    skip: process.env.ETY_ENV !== 'local',
  })
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [titleModalOpen, setTitleModalOpen] = useState<boolean>(false)
  const [createSaveState] = useCreateSavestateMutation()
  const [restoreSaveState] = useRestoreSavestateMutation()
  const [deleteSaveState] = useDeleteSavestateMutation()

  useLayoutEffect(() => {
    if (router.isReady && user?.id) {
      reportRouteChange(router.pathname, user.id)
    }

    const handleRouteChange = () => {
      setNavPath(getActivePath(router))
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, user?.id])

  const setCookie = (type: 'organizer' | 'player1' | 'player2') => {
    if (type === 'organizer') {
      document.cookie = `jwt_${
        process.env.ETY_ENV
      }=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMG9yZ2FuaXplciJ9.vbaa6s740kATlbkyVWLUt1xfWUVbvLpOr1Km9m6JCKaTIA-hrOdOZ1tTAJlUmsM0N1B1Te2yqkZe0loVh2Tubw;max-age=600000;path=/;domain=${
        process.env.ETY_ENV === 'local' ? 'localhost' : '.etournity.com'
      }`
    } else if (type === 'player1') {
      document.cookie = `jwt_${
        process.env.ETY_ENV
      }=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMDAwcGxheWVyMSJ9.ISPPnBtKJLs_GR5TDA-w8jz2mqUUtTPBtcVhy6h8WQNsH0AXLO8egeQCh3WzVJptlByheHCgqyjhfX6sRHQO6A;max-age=600000;path=/;domain=${
        process.env.ETY_ENV === 'local' ? 'localhost' : '.etournity.com'
      }`
    } else if (type === 'player2') {
      document.cookie = `jwt_${
        process.env.ETY_ENV
      }=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDE0NzE3NTUsImV4cCI6MTkwMDAwMDAwMCwiYXVkIjoiZXRvdXJuaXRpZXMiLCJpc3MiOiJldG91cm5pdHkuY29tIiwic3ViIjoiYzAwMDAwMDAwMDAwMDAwMDAwcGxheWVyMiJ9.e0iBlT9aeQ5a6oe4wDYgD7rCDyHOr_XKaEIAsfudq1gBIlIV9i2rEY-L0y99SdI32lNmkdPjx_cnD1iOltPZXw;max-age=600000;path=/;domain=${
        process.env.ETY_ENV === 'local' ? 'localhost' : '.etournity.com'
      }`
    }

    router.reload()
  }

  return (
    <NavContext.Provider value={navPath}>
      <Box className={styles.layout}>
        <GlobalReportModal>
          <Box className={styles.main}>
            <Header />
            {(process.env.ETY_ENV === 'develop' ||
              process.env.ETY_ENV === 'local') && (
              <Savestates>
                {process.env.ETY_ENV === 'local' ? (
                  <>
                    <SaveNavItem
                      icon={<i className="material-icons">save</i>}
                      onClick={() => setTitleModalOpen(true)}
                    />
                    <SaveNavItem
                      icon={<i className="material-icons">list_alt</i>}
                      onClick={() => setModalOpen(true)}
                    />
                    <SaveNavItem
                      icon={<i className="material-icons">undo</i>}
                      onClick={() => {
                        toast.loading('Savestate Loading...')
                        restoreSaveState({
                          variables: {
                            title:
                              data?.savestates?.[
                                data?.savestates?.length - 1
                              ] ?? '',
                          },
                        })
                          .then(() => {
                            router.reload()
                          })
                          .catch(console.error)
                      }}
                    />
                  </>
                ) : null}
                <SaveNavItem
                  icon={<i className="material-icons">looks_one</i>}
                  onClick={() => setCookie('player1')}
                />
                <SaveNavItem
                  icon={<i className="material-icons">looks_two</i>}
                  onClick={() => setCookie('player2')}
                />
                <SaveNavItem
                  icon={<i className="material-icons">local_police</i>}
                  onClick={() => setCookie('organizer')}
                />
              </Savestates>
            )}

            <Box className={styles.content}>
              {(process.env.ETY_ENV === 'develop' ||
                process.env.ETY_ENV === 'local') && (
                <>
                  <Modal active={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box className={styles.saves}>
                      {data?.savestates?.map((save) => (
                        <Box key={save} className={styles.save}>
                          <p>{save}</p>
                          <i
                            className="material-icons"
                            onClick={() => {
                              toast.loading('Trying to load savestate...')
                              restoreSaveState({
                                variables: {
                                  title: save,
                                },
                              })
                                .then(() => {
                                  router.reload()
                                })
                                .catch(console.error)
                            }}
                          >
                            undo
                          </i>
                          <i
                            className="material-icons"
                            onClick={async () => {
                              await toast.promise(
                                deleteSaveState({
                                  variables: {
                                    title: save,
                                  },
                                })
                                  .then(() => {
                                    refetch()
                                  })
                                  .catch(console.error),
                                {
                                  loading: 'Trying to delete savestate...',
                                  success: 'Successfully deleted savestate',
                                  error: 'An error occured.',
                                }
                              )
                            }}
                          >
                            delete
                          </i>
                        </Box>
                      ))}
                    </Box>
                  </Modal>
                  <Modal
                    active={titleModalOpen}
                    onClose={() => setTitleModalOpen(false)}
                  >
                    <Input
                      title="SaveTitle"
                      placeholder="Save Title (leave blank for current date)"
                      allow-1password="false"
                      data-lpignore="true"
                      type="text"
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          await toast.promise(
                            createSaveState({
                              variables: {
                                title: e.currentTarget.value
                                  .replaceAll(' ', '_')
                                  .replace(/[^\w\s]/g, '')
                                  .toLowerCase(),
                              },
                            }).then(() => {
                              refetch()
                            }),
                            {
                              loading: 'Trying to create savestate...',
                              success: 'Savestate Created!',
                              error: `Error while creating savestate!`,
                            }
                          )
                          setTitleModalOpen(false)
                        }
                      }}
                    />
                  </Modal>
                </>
              )}
              {children}
            </Box>
            {isMobile ? (
              <BottomNav isHidden={chatOpen} />
            ) : (
              <Footer user={user} />
            )}
          </Box>
        </GlobalReportModal>
      </Box>
    </NavContext.Provider>
  )
}

export default AppLayout
