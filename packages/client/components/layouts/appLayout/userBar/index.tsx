import React, { useState, useEffect } from 'react'

import styles from './userBar.module.scss'
import { useAuth } from '@hooks/useAuth'
import Link from 'next/link'
import pkg from 'package.json'

import MenuList from '@mui/material/MenuList'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Popper from '@mui/material/Popper'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

import BugReport from '@mui/icons-material/BugReport'
import ThumbUp from '@mui/icons-material/ThumbUp'
import Logout from '@mui/icons-material/Logout'
import Gavel from '@mui/icons-material/Gavel'
import ArrowRight from '@mui/icons-material/ArrowRight'
import ArrowLeft from '@mui/icons-material/ArrowLeft'
import OpenInNew from '@mui/icons-material/OpenInNew'

import { useGlobalReportContext } from '@state/globalReportModal'

import classNames from 'classnames'
import { useRouter } from 'next/router'
import {
  DiscordIcon,
  DiscordLogo,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@public/assets/icons/customIconLib'
import { useWindowSize } from '@hooks/useWindowSize'

export const UserBar: React.FC = () => {
  const auth = useAuth()
  const user = auth?.user
  const router = useRouter()
  const { isMobile } = useWindowSize()
  const [returnTo, setReturnTo] = useState<string | undefined>(undefined)
  const [showSocials, setShowSocials] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { openModal } = useGlobalReportContext()

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget.parentElement)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setShowSocials(false)
  }

  useEffect(() => {
    setReturnTo(window.location.origin + router.asPath)
  }, [router])

  if (!user)
    return (
      <Box className={styles.userBar} data-cy="loginButton">
        <Link
          passHref
          href={`${
            process.env.GRAPHQL_SERVER_URL ?? ''
          }/auth/discord?returnTo=${returnTo}`}
        >
          <Button className={styles.logIn}>
            <p> Sign in via </p>
            {isMobile ? (
              <DiscordIcon />
            ) : (
              <DiscordLogo viewBox="0 0 84 24" sx={{ width: 84, height: 24 }} />
            )}
          </Button>
        </Link>
      </Box>
    )

  return (
    <Box className={styles.userBar} data-cy="userBar">
      <Button className={styles.menuButton} onClick={handleClick}>
        <Avatar
          sx={{ height: 32, width: 32 }}
          src={user?.linkedAccounts?.[0].avatar ?? undefined}
          alt={user.displayName}
        />
      </Button>
      <Popper
        disablePortal
        anchorEl={anchorEl}
        open={open}
        placement="bottom-end"
        sx={{ zIndex: 9001 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={10}
            className={classNames(styles.menu, {
              [styles.showSocials]: showSocials,
            })}
            data-cy="userBarDropdown"
          >
            <MenuList className={styles.menuList}>
              <MenuItem disabled className={styles.userInfo}>
                <Typography variant="label">Logged in as</Typography>
                <Typography>{`${user?.linkedAccounts?.[0].username}#${user?.linkedAccounts?.[0].discriminator}`}</Typography>
              </MenuItem>
              <Box className={styles.divider} />
              <MenuItem
                className={styles.menuItem}
                onClick={() =>
                  openModal(user?.currentParticipant?.tournament?.id)
                }
              >
                <BugReport className={styles.menuIcon} color="error" />
                <Typography color="error">Report Bug</Typography>
              </MenuItem>
              <Link passHref href="/imprintPrivacy">
                <MenuItem className={styles.menuItem}>
                  <Gavel className={styles.menuIcon} />
                  <Typography>Imprint & Privacy Policy</Typography>
                </MenuItem>
              </Link>
              <MenuItem
                className={styles.menuItem}
                data-cy="socialsButton"
                onClick={() => setShowSocials(true)}
              >
                <ThumbUp className={styles.menuIcon} />
                <Typography>Social Media</Typography>
                <ArrowRight className={styles.trailingIcon} />
              </MenuItem>
              <Box className={styles.divider} />
              <Link
                passHref
                href={`${process.env.GRAPHQL_SERVER_URL ?? ''}/auth/logout`}
              >
                <MenuItem
                  className={styles.menuItem}
                  onClick={() => auth.logout()}
                >
                  <Logout className={styles.menuIcon} />
                  <Typography>Log Out</Typography>
                </MenuItem>
              </Link>
              <Box className={styles.version}>
                <Link passHref href="/">
                  <img
                    src="/assets/logo/nameNeutral40.svg"
                    height={10}
                    alt="Etournity Logo"
                  />
                </Link>
                <span>{`v${pkg.version}`}</span>
              </Box>
            </MenuList>
            <MenuList className={styles.socialsList}>
              <MenuItem
                className={styles.menuItem}
                onClick={() => setShowSocials(false)}
              >
                <ArrowLeft className={styles.menuIcon} />
                <Typography>Back</Typography>
              </MenuItem>
              <a
                href="https://discord.gg/ysm29w7Yxn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem
                  className={classNames(styles.menuItem, styles.socialLink)}
                  data-cy="socialLink"
                >
                  <DiscordIcon className={styles.menuIcon} />
                  <Typography>Discord</Typography>
                  <OpenInNew
                    className={styles.trailingIcon}
                    sx={{ height: 16, width: 16 }}
                  />
                </MenuItem>
              </a>
              <a
                href="https://twitch.tv/etournity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem
                  className={classNames(styles.menuItem, styles.socialLink)}
                  data-cy="socialLink"
                >
                  <TwitchIcon className={styles.menuIcon} />
                  <Typography>Twitch</Typography>
                  <OpenInNew
                    className={styles.trailingIcon}
                    sx={{ height: 16, width: 16 }}
                  />
                </MenuItem>
              </a>
              <a
                href="https://twitter.com/etournity_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem
                  className={classNames(styles.menuItem, styles.socialLink)}
                  data-cy="socialLink"
                >
                  <TwitterIcon className={styles.menuIcon} />
                  <Typography>Twitter</Typography>
                  <OpenInNew
                    className={styles.trailingIcon}
                    sx={{ height: 16, width: 16 }}
                  />
                </MenuItem>
              </a>
              <a
                href="https://www.instagram.com/etournity_app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem
                  className={classNames(styles.menuItem, styles.socialLink)}
                  data-cy="socialLink"
                >
                  <InstagramIcon className={styles.menuIcon} />
                  <Typography>Instagram</Typography>
                  <OpenInNew
                    className={styles.trailingIcon}
                    sx={{ height: 16, width: 16 }}
                  />
                </MenuItem>
              </a>
              <a
                href="https://www.youtube.com/channel/UCHv5O3nwSw2ToDWRO5tRgnA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MenuItem
                  className={classNames(styles.menuItem, styles.socialLink)}
                  data-cy="socialLink"
                >
                  <YoutubeIcon className={styles.menuIcon} />
                  <Typography>YouTube</Typography>
                  <OpenInNew
                    className={styles.trailingIcon}
                    sx={{ height: 16, width: 16 }}
                  />
                </MenuItem>
              </a>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}
