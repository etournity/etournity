import React from 'react'
import styles from './community.module.scss'
import Box from '@mui/material/Box'
import Button from '@components/landingPage/button'

const Community = () => {
  const videoId = '1IWWIdZZY6YRTmQOfL89Y3NEQufz1eQbh'

  const handleButtonClick = () => {
    if (typeof window !== 'undefined') {
      window.open('https://discord.com/invite/ysm29w7Yxn', '_blank')
    }
  }

  return (
    <Box className={styles.community} data-cy="community">
      <Box className={styles.videoWrapper}>
        <video muted autoPlay loop className={styles.video}>
          <source
            type="video/mp4"
            src={`https://drive.google.com/uc?export=download&id=${videoId}`}
          />
        </video>
        <Box className={styles.videoOverlay} />
      </Box>

      <Box className={styles.content}>
        <h1 className={styles.title}>JOIN THE COMMUNITY</h1>
        <p className={styles.description}>
          Interested in upcoming features? Want to stay up-to-date with our
          development? We would love to get to know you!
        </p>
        <Button
          color="black"
          className={styles.button}
          data-cy="communityDiscordButton"
          onClick={handleButtonClick}
        >
          <img src="/assets/landingpage/discord.svg" alt="Disc" />
          <p>Join Discord</p>
        </Button>
      </Box>
    </Box>
  )
}

export default Community
