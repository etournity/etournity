import React from 'react'
import styles from './findLobby.module.scss'
import Box from '@mui/material/Box'
import SectionTitle from '@components/landingPage/sectionTitle'
import useOnScreen from '@utils/useOnScreen'

const Img = ({ name }: { name: string }) => (
  <img
    className={`${styles.image} ${styles[name]}`}
    src={`/assets/landingpage/findLobby${name}.svg`}
    alt={name}
  />
)

const FindLobby = () => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { everShown } = useOnScreen(ref)
  const visibleClassName = everShown ? styles.visible : ''

  return (
    <Box className={styles.findLobby}>
      <SectionTitle
        title="Play games with the community"
        description="With all these tools at your disposal, we need to make sure that you know what's happening at every step of the way when your using Etournity."
      />
      <Box className={styles.SearchWrapper}>
        <Img name="SearchLg" />
        <Img name="SearchSm" />
      </Box>
      <Box ref={ref} className={`${styles.bottom} ${visibleClassName}`}>
        <Img name="Filters" />
        <Box className={styles.CardWrapper}>
          <Img name="Card1" />
          <Img name="Card2" />
          <Img name="Card3" />
        </Box>
      </Box>
    </Box>
  )
}

export default FindLobby
