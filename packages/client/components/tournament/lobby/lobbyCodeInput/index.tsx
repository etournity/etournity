import React, { ReactNode } from 'react'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import styles from './lobbyCode.module.scss'

interface LobbyCodeInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  gameLobbyCode?: string
  helpText?: ReactNode
  buttonOnClick?: () => void
  showButton?: boolean
  insteadInput?: ReactNode
  capture?: boolean | 'user' | 'environment'
}

export const LobbyCodeInput: React.FC<LobbyCodeInputProps> = ({
  title,
  helpText,
  buttonOnClick,
  showButton = true,
  insteadInput,
  ...rest
}) => (
  <div className={styles.wrapper}>
    <h5 className={styles.title}>{title}</h5>
    <div className={styles.actionWrapper}>
      <div className={styles.inputWrapper}>
        {insteadInput ?? <input {...rest} />}
      </div>
    </div>
    {showButton && (
      <Button
        className={styles.button}
        variant="secondary"
        onClick={buttonOnClick}
      >
        Next
      </Button>
    )}
    <div className={styles.helpText}>{helpText}</div>
  </div>
)
