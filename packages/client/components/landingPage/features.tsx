import React from 'react'
import styles from './features.module.scss'
import Box from '@mui/material/Box'
import SectionTitle from './sectionTitle'
import InfoCard from './infoCard'
import useOnScreen from '@utils/useOnScreen'

const Features = () => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { everShown } = useOnScreen(ref)
  const visibleClassName = everShown ? styles.visible : ''

  return (
    <Box className={styles.features} data-cy="features">
      <SectionTitle
        title="All you need in one place"
        description="Take control of your tournament creation with these tools."
      />

      <Box ref={ref} className={`${styles.bottom} ${visibleClassName}`}>
        <InfoCard
          title="Automated Tournaments"
          description="Players are taken through your event step-by-step, great for beginners!"
          icon="easyInvite.svg"
          styles={styles}
        />
        <InfoCard
          title="Unexpected Problems?"
          description="Players can report issues straight to your dashboard."
          icon="ticketingSystem.svg"
          styles={styles}
        />
        <InfoCard
          title="Admin Dashboard"
          description="All tournament info on a single screen."
          icon="tournamentController.svg"
          styles={styles}
        />
      </Box>
    </Box>
  )
}

export default Features
