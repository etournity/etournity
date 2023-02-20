import { NodeConfig } from 'konva/lib/Node'
import React, { useState } from 'react'
import { Rect, Group, Text, Circle, Image } from 'react-konva'
import styles from './bracketViz.module.scss'
import { bracketDefaults, Match, TeamResult } from '.'
import { MatchStatus } from '@generated/graphql'
import tinycolor from 'tinycolor2'
import useImage from 'use-image'

interface MatchNodeProps extends NodeConfig {
  match: Match | undefined
  cornerRadius?: number
  bestOf?: number
  activeTeamId?: string | null
  userTeamId?: string
  onMatchClick?: (match: Match) => void
  onActiveChange?: (teamId: string | null) => void
}

const isActive = (matchStatus: MatchStatus | undefined): boolean =>
  matchStatus
    ? [
        MatchStatus.Started,
        MatchStatus.PrepPhase,
        MatchStatus.GamePhase,
      ].includes(matchStatus)
    : false

export const MatchNode = ({
  width,
  height,
  cornerRadius = 5,
  match,
  bestOf,
  activeTeamId,
  onActiveChange,
  userTeamId,
  onMatchClick,
  ...rest
}: MatchNodeProps) => {
  const minWinScore = Math.ceil((bestOf ?? 0) / 2)

  const yourMatch =
    match?.teamResults?.find((result) => result?.team?.id === userTeamId) !==
    undefined

  const statusColor = isActive(match?.status)
    ? styles.primary
    : match?.status === MatchStatus.Error
    ? styles.error
    : 'transparent'

  const [fighting] = useImage('/assets/icons/fightingIcon.svg')
  const [error] = useImage('/assets/icons/error.svg')

  return (
    <Group
      {...rest}
      onClick={() => {
        if (match && (match?.teamResults?.length ?? 0) >= 2)
          onMatchClick?.(match)
      }}
    >
      <Rect
        {...bracketDefaults.base}
        fillAfterStrokeEnabled
        width={width}
        height={height}
        stroke={statusColor}
        strokeWidth={4}
        fill={styles.void}
        cornerRadius={cornerRadius}
      />

      <Text
        {...bracketDefaults.base}
        text={match?.number?.toString()}
        y={64 - 6}
        x={0}
        fill={styles.white}
        fontSize={14}
        width={33}
        align="center"
      />

      <Group x={33}>
        {Array(2)
          .fill(null)
          .map((_, i) => match?.teamResults?.[i])
          .map((result, i) => (
            <CardInside
              key={result?.team?.id}
              result={match?.teamResults?.[i]}
              won={minWinScore <= (match?.teamResults?.[i]?.score ?? 0)}
              you={result?.team?.id === userTeamId}
              cornerRadius={cornerRadius}
              index={i}
              y={i * 64}
              activeTeamId={activeTeamId}
              matchStatus={match?.status}
              onHover={onActiveChange}
            />
          ))}
      </Group>

      {isActive(match?.status) && !yourMatch ? (
        <Group x={(width ?? 0) - 36} listening={false}>
          <Rect
            {...bracketDefaults.base}
            fillAfterStrokeEnabled
            width={36}
            height={20}
            cornerRadius={[0, 0, 0, cornerRadius]}
            fill={styles.primary}
          />
          <Text
            {...bracketDefaults.base}
            fontStyle="800"
            fontSize={8}
            fill={styles.steel}
            text="ACTIVE"
            width={36}
            height={20}
            verticalAlign="middle"
            align="center"
          />
        </Group>
      ) : (
        <Group x={(width ?? 0) - 36} listening={false}>
          <Rect
            {...bracketDefaults.base}
            fillAfterStrokeEnabled
            width={36}
            height={height}
            fill={statusColor}
          />
          {yourMatch && isActive(match?.status) && (
            <Image {...bracketDefaults.base} image={fighting} x={7} y={50} />
          )}
          {match?.status === MatchStatus.Error && (
            <Image {...bracketDefaults.base} image={error} x={15} y={50} />
          )}
        </Group>
      )}
    </Group>
  )
}

interface CardInsideProps extends NodeConfig {
  result?: TeamResult | null
  status?: MatchStatus
  cornerRadius: number
  index: number
  won?: boolean
  you?: boolean
  activeTeamId?: string | null
  onHover?: (teamId: string | null) => void
}

const CardInside = ({
  result,
  won,
  you,
  cornerRadius,
  index,
  activeTeamId,
  onHover,
  status,
  ...rest
}: CardInsideProps) => {
  const [hover, setHover] = useState(false)
  const [people] = useImage('/assets/icons/people.svg')
  const [avatar] = useImage(result?.team?.avatar ?? '')

  const statusColor = isActive(status)
    ? styles.primary
    : status === MatchStatus.Error
    ? styles.error
    : result?.team?.id
    ? styles.primaryaccent
    : styles.plastic

  return (
    <Group {...rest}>
      <Rect
        {...bracketDefaults.base}
        fill={
          you
            ? hover
              ? tinycolor(won ? styles.ashBlack : styles.steel)
                  .brighten(2)
                  .toHexString()
              : won
              ? styles.ashBlack
              : styles.steel
            : hover
            ? tinycolor(styles.plastic).brighten(2).toHexString()
            : styles.plastic
        }
        width={313}
        height={64}
        cornerRadius={
          index === 0
            ? [cornerRadius, cornerRadius, 0, 0]
            : [0, 0, cornerRadius, cornerRadius]
        }
      />
      {result?.team?.seed ? (
        <Text
          {...bracketDefaults.base}
          {...bracketDefaults.text}
          text={result.team.seed.toString()}
          y={32 - 5}
          x={0}
          width={45}
          align="center"
        />
      ) : (
        <Rect height={16} width={16} y={32 - 8} x={16} fill={styles.steel} />
      )}
      {result?.team?.avatar ? (
        <RoundedImage
          {...bracketDefaults.base}
          y={14}
          x={32 + 18 / 2}
          image={avatar}
          width={35}
          height={35}
          cornerRadius={19.8}
        />
      ) : result?.team?.name ? (
        <Image
          {...bracketDefaults.base}
          y={18}
          x={48}
          height={24}
          width={24}
          image={people}
        />
      ) : (
        <Circle
          {...bracketDefaults.base}
          y={32}
          x={42 + 35 / 2}
          fill={styles.steel}
          height={35}
          width={35}
        />
      )}
      {you && (
        <Text
          {...bracketDefaults.base}
          text="YOU"
          fill={styles.middleGrey}
          y={16}
          x={85}
          width={160}
          fontStyle="700"
          fontSize={10}
        />
      )}
      {result?.team?.name ? (
        <Text
          {...bracketDefaults.base}
          {...bracketDefaults.text}
          text={result.team.name}
          fill={won ?? !result.score ? styles.white : bracketDefaults.text.fill}
          y={32 - 5}
          x={85}
          width={160}
        />
      ) : (
        <Rect height={16} width={160} y={32 - 8} x={85} fill={styles.steel} />
      )}
      <Text
        {...bracketDefaults.base}
        {...bracketDefaults.text}
        text={result?.score?.toString()}
        fill={won ? styles.white : bracketDefaults.text.fill}
        y={32 - 10}
        x={249}
        width={17}
        align="center"
        fontStyle="700"
        fontSize={24}
      />
      {result?.score !== undefined && (
        <Rect
          {...bracketDefaults.base}
          fill={won ? styles.primary : styles.charcoal}
          x={277 + 10}
          y={23}
          rotation={45}
          height={12}
          width={12}
          strokeWidth={2}
          stroke={won ? styles.primary : styles.ashBlack}
        />
      )}
      <Rect
        strokeHitEnabled
        x={1}
        y={1}
        width={311}
        height={62}
        stroke={activeTeamId === result?.team?.id ? statusColor : 'transparent'}
        strokeWidth={2}
        cornerRadius={
          index === 0
            ? [cornerRadius, cornerRadius, 0, 0]
            : [0, 0, cornerRadius, cornerRadius]
        }
        onMouseEnter={() => {
          if (result?.team?.id) setHover(true)
          onHover?.(result?.team?.id ?? '')
        }}
        onMouseLeave={() => {
          setHover(false)
          onHover?.(null)
        }}
      />
    </Group>
  )
}

const RoundedImage = ({
  x,
  y,
  width,
  height,
  cornerRadius,
  image,
}: {
  x: number
  y: number
  width: number
  height: number
  cornerRadius: number
  image: CanvasImageSource | undefined
}) => (
  <Group
    clipFunc={(ctx: any) => {
      ctx.beginPath()
      ctx.moveTo(x + cornerRadius, y)
      ctx.lineTo(x + width - cornerRadius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + cornerRadius)
      ctx.lineTo(x + width, y + height - cornerRadius)
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - cornerRadius,
        y + height
      )
      ctx.lineTo(x + cornerRadius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - cornerRadius)
      ctx.lineTo(x, y + cornerRadius)
      ctx.quadraticCurveTo(x, y, x + cornerRadius, y)
      ctx.closePath()
    }}
  >
    <Image x={x} y={y} width={width} height={height} image={image} />
  </Group>
)
