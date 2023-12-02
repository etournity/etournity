import React, { useEffect } from 'react'
import styles from './tetris.module.scss'
import Box from '@mui/material/Box'
import Button from '@components/landingPage/button'
import { useRouter } from 'next/router'

const Tetris = () => {
  const router = useRouter()

  return (
    <Box className={styles.tetris} data-cy="tetris">
      <Box className={styles.content}>
        <h1 className={styles.title}> JUMP RIGHT INTO IT.</h1>
        <Box className={styles.buttonWrapper}>
          <Button
            color="primary"
            data-cy="tetrisCreateButton"
            onClick={() => router.push('/tournament/new')}
          >
            Create Tournament
          </Button>
          <Button
            color="plain"
            data-cy="tetrisJoinButton"
            onClick={() => router.push('/tournaments')}
          >
            Join Tournament
          </Button>
        </Box>
      </Box>
      <img
        className={styles.tetrisTiles}
        src="/assets/landingpage/tetris1.svg"
      />
      <img
        className={styles.tetrisTiles}
        src="/assets/landingpage/tetris2.svg"
      />
      <img
        className={styles.tetrisTiles}
        src="/assets/landingpage/tetris3.svg"
      />
      <img
        className={styles.tetrisTiles}
        src="/assets/landingpage/tetris4.svg"
      />
    </Box>
  )
}

export default Tetris
