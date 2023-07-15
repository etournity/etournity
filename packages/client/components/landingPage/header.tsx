import Box from '@mui/material/Box'
import styles from './header.module.scss'
import React, { useEffect } from 'react'
import Button from '@components/landingPage/button'
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter()

  const [vidIndex, setVidIndex] = React.useState(0)
  const ref = React.useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (vidIndex === 1 && ref.current) {
      ref.current.play()
    }
  }, [ref, vidIndex])

  return (
    <Box className={styles.header}>
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
            src="https://drive.google.com/uc?export=download&id=1Uf8UXRBa4FBx4D3Ha367Rw7_JgwWV5DB"
          />
        </video>
        <video
          ref={ref}
          muted
          loop
          className={styles.video}
          style={{ display: vidIndex === 1 ? 'block' : 'none' }}
        >
          <source
            type="video/mp4"
            src="https://drive.google.com/uc?export=download&id=1Pd3BlQ6DwHFyfTGQJTWlaPnq1jrY2ReB"
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
            onClick={() => router.push('/tournament/new')}
          >
            Create Tournament
          </Button>
          <Button color="plain" onClick={() => router.push('/tournaments')}>
            Join Tournament
          </Button>
        </Box>
      </Box>

      <Box className={styles.banner}>
        <h1 className={styles.bannerTitle}>WELCOME TO ETOURNITY.</h1>
        <p className={styles.bannerDescription}>
          Your esports tournament creation platform.
        </p>
      </Box>
    </Box>
  )
}

export default Header
