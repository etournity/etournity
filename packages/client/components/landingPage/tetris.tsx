import React, { useEffect, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import styles from './tetris.module.scss'
import Box from '@mui/material/Box'
import useOnScreen from '@utils/useOnScreen'

const Tetris = () => {
  const [mousePosition, setMousePosition] = useState(0)

  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
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
  }, [isIntersecting])

  return (
    <Box className={styles.component}>
      <Box ref={ref}>
        <Unity unityProvider={unityProvider} className={styles.tetris} />
      </Box>
      <Box className={styles.content}>
        <h1 className={styles.title}> JUMP RIGHT INTO IT.</h1>
        <p className={styles.description}>
          {' '}
          What better way than to strive to be the best than with out community.
          Help us build the best tournament platform of tomorrow.{' '}
        </p>
      </Box>
    </Box>
  )
}

export default Tetris
