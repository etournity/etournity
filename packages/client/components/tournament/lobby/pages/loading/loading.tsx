import { Loader } from '@components/ui/loader'
import React from 'react'
import { LobbyPageProps } from './../../'
import styles from './loading.module.scss'

export const Loading: React.FC<LobbyPageProps> = () => (
  <div className={styles.wrapper}>
    <Loader size={4} strokeWidth={0.375} />
  </div>
)
