import Box from '@mui/material/Box'
import styles from './header.module.scss'
import React, { useEffect } from 'react'
import Button from '@components/landingPage/button'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()
  const introVideoUrl = '1ZHcj20eLPPYh043mHOOSS6sOh_-NxfOC'
  const loopingVideoUrl = '1vrB3kzXjgl_4qdetyHYQb6YG181kNiSM'

  const [vidIndex, setVidIndex] = React.useState(0)
  const ref = React.useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (vidIndex === 1 && ref.current) {
      void ref.current.play()
    }
  }, [ref, vidIndex])

  return (
    <Box className={styles.header} data-cy="header">
      <Box className={styles.videoWrapper}>
        <video
          autoPlay
          muted
          className={styles.video}
          style={{ display: vidIndex === 0 ? 'block' : 'none' }}
          onEnded={() => setVidIndex(1)}
        >
          <source
            type="video/mp4"
            src={`https://drive.google.com/uc?export=download&id=${introVideoUrl}`}
          />
        </video>
        <video
          ref={ref}
          muted
          loop
          preload="auto"
          className={styles.video}
          style={{ display: vidIndex === 1 ? 'block' : 'none' }}
        >
          <source
            type="video/mp4"
            src={`https://drive.google.com/uc?export=download&id=${loopingVideoUrl}`}
          />
        </video>
      </Box>

      <Box className={styles.content}>
        <h1 className={styles.title}>
          {'TOURNAMENT CREATION DONE '}
          <span className={styles.titleHighlight}>RIGHT</span>
        </h1>
        <Box className={styles.buttonWrapper}>
          <Button
            color="primary"
            data-cy="headerCreateButton"
            onClick={() => router.push('/tournament/new')}
          >
            Create Tournament
          </Button>
          <Button
            color="plain"
            data-cy="headerJoinButton"
            onClick={() => router.push('/tournaments')}
          >
            Join Tournament
          </Button>
        </Box>
      </Box>

      <Box className={styles.banner}>
        <h1 className={styles.bannerTitle}>WELCOME TO ETOURNITY.</h1>
        <p className={styles.bannerDescription}>
          Esports Tournaments - Easy & Open Source
        </p>
      </Box>
    </Box>
  )
}

export default Header
