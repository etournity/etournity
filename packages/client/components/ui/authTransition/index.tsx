import { Icon } from '@components/ui/icon'
import classNames from 'classnames'
import React, { ReactElement, useState } from 'react'
import styles from './authTransition.module.scss'

export interface AuthTransitionProps {
  children: ReactElement
  successful: boolean
}

export const AuthTransition: React.FC<AuthTransitionProps> = ({
  children,
  successful,
}) => {
  const [isVisible, setIsVisible] = useState(true)
  setTimeout(() => {
    setIsVisible(false)
  }, 4000)

  return (
    <div className={styles.authTransition}>
      {children}
      <div
        className={classNames(styles.transition, {
          [styles.visible]: !isVisible,
        })}
      >
        {successful ? (
          <div>
            <Icon variant="tick" size={4} />
            <p>SIGN IN SUCCESSFUL</p>
          </div>
        ) : (
          <div>
            <Icon variant="close" size={4} />
            <p>SIGN IN FAILED</p>
          </div>
        )}
      </div>
    </div>
  )
}
