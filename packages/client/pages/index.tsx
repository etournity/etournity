import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import CallMergeOutlinedIcon from '@mui/icons-material/CallMergeOutlined'
import MoodOutlinedIcon from '@mui/icons-material/MoodOutlined'
import styles from './landingpage.module.scss'
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import Link from 'next/link'
import { DiscordIcon } from '@public/assets/icons/customIconLib'

const LandingPage = () => {
  const [carouselStatus, setCarouselStatus] = useState<
    'readyCheck' | 'codeExchange' | 'scoreSub'
  >('readyCheck')
  const [timerPause, setTimerPause] = useState(false)

  const handleHover = (title: 'readyCheck' | 'codeExchange' | 'scoreSub') => {
    setCarouselStatus(title)
    setTimerPause(true)
  }

  useEffect(() => {
    if (!timerPause) {
      const interval = setInterval(() => {
        if (carouselStatus === 'readyCheck') {
          setCarouselStatus('codeExchange')
        } else if (carouselStatus === 'codeExchange') {
          setCarouselStatus('scoreSub')
        } else if (carouselStatus === 'scoreSub') {
          setCarouselStatus('readyCheck')
        }
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [timerPause, carouselStatus, setCarouselStatus])

  const uspCardStyle = {
    width: { xs: 260, sm: 260, md: 268, lg: 320, xl: 360 },
  }
  return (
    <Box
      className={styles.landingpage}
      sx={{
        bgcolor: 'color.background',
      }}
      data-cy="landingpage"
    >
      <Box className={styles.gradientBox}>
        <Box className={styles.jumbotron} data-cy="landingpage-jumbotron">
          <Box className={styles.header}>
            <img
              src="/assets/logo/namePrimary.svg"
              className={styles.etournityLogo}
            />
            <p>PUBLIC ALPHA</p>
          </Box>
          <Typography variant="headline" className={styles.headline}>
            Save time & energy while organizing tournaments
          </Typography>
          <Box className={styles.buttonBox}>
            <Link passHref href="/tournament/new">
              <Button
                className={styles.createButton}
                variant="contained"
                data-cy="createButton"
              >
                <img src="/assets/logo/brawlhallaLogo.svg" />
                <Typography variant="label">
                  Create Brawlhalla Tournament
                </Typography>
              </Button>
            </Link>
            <Typography variant="label" className={styles.label}>
              1v1 - Single Elimination
            </Typography>
          </Box>
        </Box>

        <Box className={styles.graphicsContainer} data-cy="graphicsContainer">
          <Typography variant="headline" className={styles.headline}>
            Built to solve your problems
          </Typography>
          <Box
            className={classnames(styles.hosthubBox, styles.graphicsWrapper)}
          >
            <Box
              sx={{
                width: { xs: 328, sm: 398, md: 418, lg: 428, xl: 433 },
                mr: {
                  xs: 0,
                  sm: '1.5rem',
                  md: '3rem',
                  lg: '3rem',
                  xl: '3rem',
                },
              }}
            >
              <img src="/assets/landingpage/HostHub.svg" />
            </Box>
            <Box
              sx={{
                width: { xs: 328, sm: 398, md: 418, lg: 428, xl: 433 },
              }}
            >
              <Typography variant="title">
                Host Hub - For Organizers & Moderators
              </Typography>
              <Typography variant="body">
                <ul>
                  <li>Complete tournament control</li>
                  <li>Easy player management</li>
                  <li>Automatic Bracket Creation</li>
                  <li>Quickly help players</li>
                </ul>
              </Typography>
            </Box>
          </Box>

          <Box
            className={classnames(styles.matchlobbyBox, styles.graphicsWrapper)}
          >
            <Box
              sx={{
                width: { xs: 328, sm: 398, md: 418, lg: 428, xl: 456 },
                textAlign: 'left',
                lineHeight: { xs: '1rem', md: '1.25rem' },
                fontSize: { xs: '0.875rem', md: '1rem' },
              }}
            >
              <Typography variant="title">
                Match Lobby - For the Players
              </Typography>
              <Typography variant="body">
                <ul>
                  <li
                    className={classnames({
                      [styles.liHover]: carouselStatus === 'readyCheck',
                    })}
                    data-cy="readyCheck"
                    onMouseOver={() => handleHover('readyCheck')}
                    onMouseOut={() => setTimerPause(false)}
                  >
                    Check-in timer for each match
                  </li>
                  <li
                    className={classnames({
                      [styles.liHover]: carouselStatus === 'codeExchange',
                    })}
                    data-cy="codeExchange"
                    onMouseOver={() => handleHover('codeExchange')}
                    onMouseOut={() => setTimerPause(false)}
                  >
                    Quick Lobby Code exchange for easy communication
                  </li>
                  <li
                    className={classnames({
                      [styles.liHover]: carouselStatus === 'scoreSub',
                    })}
                    data-cy="scoreSub"
                    onMouseOver={() => handleHover('scoreSub')}
                    onMouseOut={() => setTimerPause(false)}
                  >
                    Simple Score Submission + Automatic comparison
                  </li>
                </ul>
              </Typography>
            </Box>
            <Box
              data-cy="matchlobby-graphic"
              sx={{
                width: { xs: 328, sm: 398, md: 418, lg: 428, xl: 433 },
                maxWidth: 456,
                ml: {
                  xs: 0,
                  sm: 0,
                  md: '3rem',
                  lg: '3rem',
                  xl: '3rem',
                },
              }}
            >
              {carouselStatus === 'readyCheck' ? (
                <img data-cy="img" src="/assets/landingpage/readyCheck.svg" />
              ) : carouselStatus === 'codeExchange' ? (
                <img data-cy="img" src="/assets/landingpage/codeExchange.svg" />
              ) : (
                <img data-cy="img" src="/assets/landingpage/scoreSub.svg" />
              )}
            </Box>
          </Box>
        </Box>

        <Box data-cy="uspCards" className={styles.uspCards}>
          <Box className={styles.card} sx={uspCardStyle}>
            <ChatOutlinedIcon className={styles.icon} color="primary" />
            <Typography variant="title" className={styles.title}>
              Streamlined Communication
            </Typography>
            <Typography variant="body" className={styles.body}>
              Players submit issues directly to your dashboard (Hub), easily
              solvable for you and your mods.
            </Typography>
          </Box>
          <Box
            className={classnames(styles.card, styles.middle)}
            sx={uspCardStyle}
          >
            <CallMergeOutlinedIcon className={styles.icon} color="primary" />
            <Typography variant="title" className={styles.title}>
              All-In-One Platform
            </Typography>
            <Typography variant="body" className={styles.body}>
              All relevant data in one place, no need for using spreadsheets.
              <br />
              <br />
              Players simply exchange lobby codes, scores are compared
              automatically.
              <br />
              <br />
              Built-in bracket generation (and they look great, too)
            </Typography>
          </Box>
          <Box className={styles.card} sx={uspCardStyle}>
            <MoodOutlinedIcon className={styles.icon} color="primary" />
            <Typography variant="title" className={styles.title}>
              Easy to Use For Players
            </Typography>
            <Typography variant="body" className={styles.body}>
              Built to be intuitively usable - even for beginners.
              <br />
              <br />
              Players are guided through your tournament, everything on one
              platform.
              <br />
              <br />
              Also: dark mode! (suck it Smash)
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className={styles.backgroundBox}>
        <img
          className={styles.brightEBackground}
          src="/assets/landingpage/EtournityBrightE.svg"
        />
      </Box>

      <Box className={styles.footerAlpha}>
        <Box
          className={styles.textBox}
          sx={{
            width: { xs: 328, sm: 420, lg: 508, xl: 618 },
          }}
        >
          <Box className={styles.publicAlpha}>
            <Typography variant="headline" className={styles.alphaHeader}>
              This is a PUBLIC ALPHA!
            </Typography>
            <Typography variant="label" className={styles.label}>
              I repeat: <i>ALPHA!</i>
            </Typography>
          </Box>
          <Box>
            <Typography variant="title" className={styles.title}>
              Current Tournament Support
            </Typography>
            <Typography variant="body" className={styles.body}>
              Brawlhalla • 1v1 • Single Elimination
            </Typography>
            <br />
          </Box>
          <Box>
            <Typography variant="title">What to expect</Typography>
            <Typography variant="body">
              <ul>
                <li>New features are added based on your feedback</li>
                <li>Designs will change</li>
                <li>Some features feel unpolished and might break</li>
                <li>
                  Unhappy with anything or have feature requests? Message us on
                  Discord!
                </li>
              </ul>
            </Typography>
          </Box>
          <Typography variant="label" className={styles.reminder}>
            Remember: We are building a platform FOR YOU. Tell us what you like
            and dislike!
          </Typography>
        </Box>
        <Box
          className={styles.discordBox}
          sx={{
            m: {
              xs: 0,
              sm: '4.25rem',
              md: '4.25rem',
              lg: '4.25rem',
              xl: '4.25rem',
            },
          }}
        >
          <Box className={styles.joinOurDiscord}>
            <DiscordIcon className={styles.logo} />
            <Typography variant="label">Join our Discord</Typography>
          </Box>
          <iframe
            data-cy="discord-iframe"
            src="https://discord.com/widget?id=688104154425458693&theme=dark"
            width="350"
            height="500"
            frameBorder="0"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </Box>
      </Box>

      <Box className={styles.footerMission}>
        <Typography variant="headline" className={styles.headline}>
          <strong>Be among the first</strong> to join our mission of building
          your favorite esports platform.
        </Typography>
        <Box className={styles.buttonBox}>
          <Link passHref href="/tournament/new">
            <Button
              data-cy="createButtonTwo"
              className={styles.createButton}
              variant="contained"
              color="secondary"
            >
              <img src="/assets/logo/brawlhallaLogo.svg" />
              <Typography variant="label" className={styles.label}>
                Create Brawlhalla Tournament
              </Typography>
            </Button>
          </Link>
          <Typography variant="label" className={styles.label2}>
            1v1 - Single Elimination
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default LandingPage
