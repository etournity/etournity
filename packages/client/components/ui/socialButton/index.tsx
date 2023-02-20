import React, { useEffect, useState } from 'react'
import styles from './socialButton.module.scss'
import classNames from 'classnames'

export interface SocialButtonProps {
  className?: string
  link: string
  description?: string
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  className,
  link,
  description,
}) => {
  const [platform, setPlatform] = useState<
    'Discord' | 'Twitch' | 'Youtube' | 'Default'
  >('Default')

  const fallback = (url: string) => {
    const parts = url.split('//')
    if (!parts[1]) console.error('No protocol found.')
    const withoutProtocol = parts[1] ?? parts[0]
    const domain = withoutProtocol.split('.')
    const platform = domain[0] === 'www' ? domain[1] : domain[0]
    return platform
  }

  useEffect(() => {
    switch (true) {
      case link.includes('discord'):
        setPlatform('Discord')
        break
      case link.includes('twitch'):
        setPlatform('Twitch')
        break
      case link.includes('youtube'):
        setPlatform('Youtube')
        break
      default:
        setPlatform('Default')
        break
    }
  }, [setPlatform, link])

  return (
    <a target="_blank" href={link} rel="noreferrer noopener">
      <div
        className={classNames(styles.socialButton, className, styles[platform])}
      >
        <div className={classNames(styles.upperDiv)}>
          {platform === 'Discord' ? (
            <img
              src="/assets/icons/discord.svg"
              height={24}
              width="100%"
              alt="Discord"
            />
          ) : platform === 'Twitch' ? (
            <img
              src="/assets/icons/twitch.svg"
              height={24}
              width="100%"
              alt="Twitch"
            />
          ) : platform === 'Youtube' ? (
            <img
              src="/assets/icons/youtube.svg"
              height={24}
              width="100%"
              alt="Youtube"
            />
          ) : (
            <p>{fallback(link).toUpperCase() ?? 'STREAM'}</p>
          )}
        </div>
        <div className={styles.text}>
          {description ?? platform === 'Discord'
            ? 'JOIN THE DISCORD'
            : platform === 'Twitch'
            ? 'WATCH ON TWITCH'
            : platform === 'Youtube'
            ? 'WATCH ON YOUTUBE'
            : 'WATCH STREAM'}
        </div>
      </div>
    </a>
  )
}
