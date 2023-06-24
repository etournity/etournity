import React from 'react'
import styles from './features.module.scss'
import Box from '@mui/material/Box'
import SectionTitle from './sectionTitle'
import InfoCard from './infoCard'

const Features = () => (
  <Box className={styles.features}>
    <SectionTitle
      title="All you need in one place"
      description="Take control of your tournament creation with these tools."
    />

    <Box className={styles.bottom}>
      <InfoCard
        title="Easy Invite"
        description="Get people to your lobby with just a single 4-digit code."
        icon="easyInvite.svg"
        styles={styles}
      />
      <InfoCard
        title="Ticketing System"
        description="Get feedback from participants as the tournament is going on."
        icon="ticketingSystem.svg"
        styles={styles}
      />
      <InfoCard
        title="General Info"
        description="Manage all the tournament information from one place."
        icon="generalInfo.svg"
        styles={styles}
      />
      <InfoCard
        title="Tournament Controller"
        description="Set up all the tournaments starting and end times."
        icon="tournamentController.svg"
        styles={styles}
      />
      <InfoCard
        title="Round Progression Controller"
        description="Have full control of tournament with round management."
        icon="roundProgressionController.svg"
        styles={styles}
      />
      <InfoCard
        title="Participant Information"
        description="Manage your participants experience through the tournament."
        icon="participantInformation.svg"
        styles={styles}
      />
    </Box>
  </Box>
)

export default Features
