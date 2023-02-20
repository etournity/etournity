import Link from 'next/link'
import React from 'react'
import styles from './footer.module.scss'
import classNames from 'classnames'
import pkg from 'package.json'
import { Button } from '@components/ui/button'
import { useRouter } from 'next/router'
import { AuthUser } from '@hooks/useAuth'
import { useGlobalReportContext } from '@state/globalReportModal'
import {
  DiscordIcon,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
  YoutubeIcon,
} from '@public/assets/icons/customIconLib'

export interface FooterProps {
  user: AuthUser | undefined
}

export const Footer: React.FC<FooterProps> = ({ user }) => {
  const { openModal } = useGlobalReportContext()
  const router = useRouter()
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.logoWrapper}>
        <Link passHref href="/">
          <img
            src="/assets/logo/nameWhite.svg"
            height={18}
            width={136}
            alt="Etournity Logo"
          />
        </Link>
        <span className={styles.version}>{`v${pkg.version}`}</span>
      </div>
      <div className={styles.center}>
        <span className={styles.links}>
          <Link passHref href="/imprintPrivacy">
            <span
              className={classNames({
                [styles.currentPage]: router.pathname === '/imprintPrivacy',
              })}
            >
              Imprint & Privacy Policy
            </span>
          </Link>
        </span>
        {user && (
          <Button
            variant="error"
            onClick={() => openModal(user?.currentParticipant?.tournament?.id)}
          >
            REPORT PROBLEM
          </Button>
        )}
      </div>
      <div className={styles.socials}>
        <a
          className={styles.discord}
          href="https://discord.gg/ysm29w7Yxn"
          target="_blank"
          rel="noreferrer noopener"
        >
          <DiscordIcon sx={{ width: 32, height: 32 }} />
        </a>
        <a
          className={styles.twitch}
          href="https://twitch.tv/etournity"
          target="_blank"
          rel="noreferrer noopener"
        >
          <TwitchIcon sx={{ width: 32, height: 32 }} />
        </a>
        <a
          className={styles.instagram}
          href="https://www.instagram.com/etournity_app/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <InstagramIcon sx={{ width: 32, height: 32 }} />
        </a>
        <a
          className={styles.twitter}
          href="https://twitter.com/etournity_app"
          target="_blank"
          rel="noreferrer noopener"
        >
          <TwitterIcon sx={{ width: 32, height: 32 }} />
        </a>
        <a
          className={styles.youtube}
          href="https://www.youtube.com/channel/UCHv5O3nwSw2ToDWRO5tRgnA"
          target="_blank"
          rel="noreferrer noopener"
        >
          <YoutubeIcon sx={{ width: 32, height: 32 }} />
        </a>
      </div>
    </footer>
  )
}
