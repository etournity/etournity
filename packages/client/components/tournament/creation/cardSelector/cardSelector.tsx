import React from 'react'
import ItemCard from '../itemCard/itemCard'
import styles from './cardSelector.module.scss'

interface CardSelectorProps<T> {
  onChange: (value?: T | null) => void
  value?: T | null
  comparator?: (a?: T | null, b?: T | null) => boolean
  options?: Array<Option<T>>
}

export interface Option<T> {
  title: string
  value?: T | null
  subtitle?: string
  img?: string
}

const CardSelector = <T,>({
  onChange,
  value,
  comparator,
  options,
}: CardSelectorProps<T>): React.ReactElement => (
  <div className={styles.selector}>
    {options?.map((o) => (
      <ItemCard
        key={o.title}
        data-cy="card-selector-option"
        title={o.title}
        subtitle={o.subtitle}
        img={o.img}
        active={value !== null && comparator?.(value, o.value)}
        disabled={!o.value}
        onClick={() => onChange(o.value ?? null)}
      />
    ))}
  </div>
)

export default CardSelector
