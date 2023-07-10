import React from 'react'
import styles from './moreInfo.module.scss'
import Box from '@mui/material/Box'
import SectionTitle from '@components/landingPage/sectionTitle'
import InfoCard from './infoCard'
import { LandingPageSectionProps } from '@app/pages'

const MoreInfo = ({ className = '' }: LandingPageSectionProps) => (
  <Box className={className}>
    <SectionTitle
      className={styles.titleWrapper}
      title="More of what we offer"
    />

    <Box className={styles.content}>
      <Box className={styles.cardWrapper}>
        <InfoCard
          title="Streamlined Communication"
          description="Players can submit issues in real time which are then displayed in your dashboard for you and your Mods to easily fix."
          icon="forum.svg"
          styles={styles}
        />
        <InfoCard
          title="All-in-One Platform"
          description="From data organization to having the ability to generate brackets at will, Etournity offers everything in one place. "
          icon="hub.svg"
          styles={styles}
        />
        <InfoCard
          title="Easy to Use For Players"
          description="From the initial invitation to the final match, we make sure all players have an easy to follow experience leaving no one behind."
          icon="touch.svg"
          styles={styles}
        />
      </Box>

      <img
        className={styles.lines}
        src="/assets/landingpage/moreInfoLines.svg"
        alt="----------"
      />
    </Box>
  </Box>
)

export default MoreInfo
