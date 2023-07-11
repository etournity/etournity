import styles from '@components/landingPage/sectionTitle.module.scss'
import Box from '@mui/material/Box'
import React from 'react'
import useOnScreen from '@utils/useOnScreen'

interface SectionTitleProps {
  title: string
  description?: string
  className?: string
}

const SectionTitle = ({
  title,
  description = '',
  className = '',
}: SectionTitleProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { everShown } = useOnScreen(ref)
  const visibleClassName = everShown ? styles.visible : ''

  return (
    <Box className={`${styles.container} ${className}`}>
      <h1 ref={ref} className={`${styles.title} ${visibleClassName}`}>
        {title}
      </h1>
      <p className={styles.description}>{description}</p>
    </Box>
  )
}

export default SectionTitle
