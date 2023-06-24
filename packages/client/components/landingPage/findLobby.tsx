import React from 'react'
import styles from './findLobby.module.scss'
import Box from '@mui/material/Box'
import SectionTitle from '@components/landingPage/sectionTitle'

const FindLobby = () => (
  <Box className={styles.findLobby}>
    <SectionTitle
      title="Play games with the community"
      description="With all these tools at your disposal, we need to make sure that you know what's happening at every step of the way when your using Etournity."
    />
    <Box className={styles.imageContainer}>
      <img
        className={`${styles.image} ${styles.imageLg}`}
        src="/assets/landingpage/findLobbyLg.png"
        alt="Find Lobby"
      />
      <img
        className={`${styles.image} ${styles.imageSm}`}
        src="/assets/landingpage/findLobbySm.png"
        alt="Find Lobby"
      />
    </Box>
  </Box>
)

export default FindLobby
