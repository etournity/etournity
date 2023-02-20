import React from 'react'
import { Icon } from '../icon'
import { Variants } from '@public/assets/icons/iconLib'
import classnames from 'classnames'
import styles from './tag.module.scss'

export interface TagProps {
  className?: string
  icon?: Variants
  description: string
}

export const Tag: React.FC<TagProps> = ({ className, icon, description }) => (
  <div className={classnames(className, styles.tag)}>
    {icon && <Icon className={styles.icon} variant={icon} size={1} />}
    <p>{description}</p>
  </div>
)
