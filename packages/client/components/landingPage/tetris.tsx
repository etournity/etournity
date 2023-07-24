import React, { useEffect } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import styles from './tetris.module.scss'
import Box from '@mui/material/Box'
import useOnScreen from '@utils/useOnScreen'
import Button from '@components/landingPage/button'
import { useRouter } from 'next/router'

const Tetris = () => {
  const router = useRouter()

  const { unityProvider, sendMessage } = useUnityContext({
    loaderUrl: '/assets/landingpage/tetris/Build/tetris.loader.js',
    dataUrl: '/assets/landingpage/tetris/Build/tetris.data',
    frameworkUrl: '/assets/landingpage/tetris/Build/tetris.framework.js',
    codeUrl: '/assets/landingpage/tetris/Build/tetris.wasm',
  })

  const ref = React.useRef<HTMLDivElement>(null)
  const { isIntersecting } = useOnScreen(ref)

  useEffect(() => {
    if (isIntersecting) {
      sendMessage('Board', 'ResumeGame')
    } else {
      sendMessage('Board', 'PauseGame')
    }
  }, [isIntersecting, sendMessage])

  return (
    <Box className={styles.component} data-cy="tetris">
      <Box ref={ref}>
        <Unity unityProvider={unityProvider} className={styles.tetris} />
      </Box>
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
    </Box>
  )
}

export default Tetris
