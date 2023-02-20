import classNames from 'classnames'
import React from 'react'
import styles from './itemCard.module.scss'

interface ItemCardProps {
  title: string
  subtitle?: string
  img?: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  img,
  active,
  onClick,
  disabled,
}) => (
  <div
    className={classNames(styles.card, {
      [styles.active]: active,
      [styles.disabled]: disabled,
    })}
    onClick={disabled ? () => {} : onClick}
  >
    <div className={styles.title}>{title}</div>
    <div className={styles.subtitle}>{subtitle}</div>
    <div
      className={styles.background}
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  </div>
)

export default ItemCard
