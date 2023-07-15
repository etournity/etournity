import React from 'react'
import styles from './community.module.scss'
import Box from '@mui/material/Box'
import Button from '@components/landingPage/button'

const Community = () => {
  const videoId = '1_1Ojo39ySBrE0V-MeIYHId_q45dYG_G5'

  const handleButtonClick = () => {
    if (typeof window !== 'undefined') {
      window.open('https://discord.com/invite/ysm29w7Yxn', '_blank')
    }
  }

  return (
    <Box className={styles.community}>
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
          We love chatting to you guys, and not only that but if you want to
          stay up to date with everything Etournity join our Discord server and
          never miss out on anything.
        </p>
        <Button
          color="black"
          className={styles.button}
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
