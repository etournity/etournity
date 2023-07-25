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
          title="Beginner Friendly"
          description="Players are taken through your event step-by-step, great for beginners!"
          icon="😃.svg"
          styles={styles}
        />
        <InfoCard
          title="Tournament creation in 5 Minutes"
          description="We make sure you get to the fun part as fast as possible."
          icon="update.svg"
          styles={styles}
        />
        <InfoCard
          title="All Settings, One Dashboard"
          description="Have full control over your event in a single place."
          icon="tournamentController.svg"
          styles={styles}
        />
        <InfoCard
          title="Automatic progression"
          description="Have a hands-off experience running the tournament."
          icon="automaticProgression.svg"
          styles={styles}
        />
        <InfoCard
          title="Unexpected Problems?"
          description="Solve player issues straight from your dashboard."
          icon="ticketingSystem.svg"
          styles={styles}
        />
      </Box>
    </Box>
  )
}

export default Features
