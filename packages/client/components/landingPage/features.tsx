import React from 'react'
import styles from './features.module.scss'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import SectionTitle from './sectionTitle'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <Card className={styles.card}>
    <img
      className={styles.cardIcon}
      src={`assets/landingpage/${icon}`}
      alt={icon}
    />
    <Box className={styles.cardText}>
      <h1 className={styles.cardTitle}>{title}</h1>
      <p className={styles.cardDescription}>{description}</p>
    </Box>
  </Card>
)

const Features = () => (
  <Box className={styles.features}>
    <SectionTitle
      title="All you need in one place"
      description="Take control of your tournament creation with these tools."
    />

    <Box className={styles.bottom}>
      <FeatureCard
        title="Easy Invite"
        description="Get people to your lobby with just a single 4-digit code."
        icon="easyInvite.svg"
      />
      <FeatureCard
        title="Ticketing System"
        description="Get feedback from participants as the tournament is going on."
        icon="ticketingSystem.svg"
      />
      <FeatureCard
        title="General Info"
        description="Manage all the tournament information from one place."
        icon="generalInfo.svg"
      />
      <FeatureCard
        title="Tournament Controller"
        description="Set up all the tournaments starting and end times."
        icon="tournamentController.svg"
      />
      <FeatureCard
        title="Round Progression Controller"
        description="Have full control of tournament with round management."
        icon="roundProgressionController.svg"
      />
      <FeatureCard
        title="Participant Information"
        description="Manage your participants experience through the tournament."
        icon="participantInformation.svg"
      />
    </Box>
  </Box>
)

export default Features
