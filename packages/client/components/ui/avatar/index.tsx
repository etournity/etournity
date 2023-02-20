import React from 'react'
import classNames from 'classnames'
import styles from './avatar.module.scss'
import { Icon } from '../icon/'
import { PartialDeep } from 'type-fest'
import { UserAccount } from '@generated/graphql'

export interface AvatarProps {
  imgSrc?: string
  size?: number
  name?: string
  className?: string
  userAccount?: PartialDeep<UserAccount>
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 1.5,
  imgSrc,
  name,
  className,
  userAccount,
}) => {
  const styleObj = {
    width: `${size}rem`,
    height: `${size}rem`,
  }
  const src = imgSrc ?? userAccount?.avatar

  return (
    <div className={classNames(styles.avatar, className)} style={styleObj}>
      {src ? (
        <img src={src} height="100%" width="100%" />
      ) : name ? (
        name.slice(0, 2).toUpperCase()
      ) : (
        <Icon className={styles.avatarFallback} variant="people" />
      )}
    </div>
  )
}
