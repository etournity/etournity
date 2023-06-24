import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import React from 'react'

interface InfoCardProps {
  title: string
  description: string
  icon: string
  styles: any
}

const InfoCard = ({ title, description, icon, styles }: InfoCardProps) => (
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

export default InfoCard
