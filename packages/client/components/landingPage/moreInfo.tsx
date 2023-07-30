import React from 'react'
import styles from './moreInfo.module.scss'
import Box from '@mui/material/Box'
import SectionTitle from '@components/landingPage/sectionTitle'
import InfoCard from './infoCard'
import { LandingPageSectionProps } from '@app/pages'
import useOnScreen from '@utils/useOnScreen'

const MoreInfo = ({ className = '' }: LandingPageSectionProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { everShown } = useOnScreen(ref)
  const visibleClassName = everShown ? styles.visible : ''

  return (
    <Box className={`${className} ${styles.moreInfo}`} data-cy="moreInfo">
      <SectionTitle
        className={styles.titleWrapper}
        title="More of what we offer"
      />

      <Box className={styles.content}>
        <Box className={styles.cardWrapper}>
          <InfoCard
            title="Streamlined Communication"
            description="If players run into a problem, our easy ticketing system lets them send help requests directly to your dashboard."
            icon="forum.svg"
            styles={styles}
          />
          <InfoCard
            title="Power at Your Fingertips"
            description="From set-up to finals, we want you to have full control over your tournament."
            icon="hub.svg"
            styles={styles}
          />
          <InfoCard
            title="Easy to Use For Players"
            description="From initial invitation to finals, players are being led through your event step-by-step. Great for beginners!"
            icon="touch.svg"
            styles={styles}
          />
        </Box>

        <Box ref={ref} className={`${styles.linesWrapper} ${visibleClassName}`}>
          <img
            className={styles.lines}
            src="/assets/landingpage/moreInfoLines.svg"
            alt="----------"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default MoreInfo
