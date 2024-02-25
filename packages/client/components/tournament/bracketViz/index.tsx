import { IFrame, Vector2d } from 'konva/lib/types'
import Konva from 'konva'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Stage, Layer, Group, Line } from 'react-konva'
import { MatchNode } from './matchNode'
import styles from './bracketViz.module.scss'
import * as PanZoom from './panzoom'
import { KonvaEventObject, NodeConfig } from 'konva/lib/Node'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import classNames from 'classnames'
import { useAuth } from '@hooks/useAuth'
import { MatchStatus, User } from '@generated/graphql'
import { AccessWrapper } from '@components/ui/accessWrapper'
import Box from '@mui/material/Box'
import FeedOutlined from '@mui/icons-material/FeedOutlined'
import FullscreenOutlined from '@mui/icons-material/FullscreenOutlined'
import { Button, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useWindowSize } from '@hooks/useWindowSize'

interface BracketVizProps {
  userTeamId?: string
  rounds?: BracketVizRound[]
  onMatchClick?: (match: Match) => void
  width?: number | string
  height?: number | string
  disableAccessWrapper?: boolean
}

export interface BracketVizRound {
  id?: string
  number: number
  bestOf: number
  matches?: Match[]
}

export interface Match {
  id?: string
  number: number
  status: MatchStatus
  teamResults?: Array<TeamResult | null>
}

export interface TeamResult {
  team: Team | null
  score?: number
}

export interface Team {
  id: string | null
  seed: number | null
  name: string | null
  avatar: string | null
}

export const bracketDefaults = {
  base: {
    listening: false,
  },
  text: {
    fontFamily: 'Proxima Nova',
    fontStyle: '600',
    fill: styles.middleGrey,
    fontSize: 14,
    wrap: 'none',
  },
}

const rectDim = [346, 128]

const BracketViz: React.FC<BracketVizProps> = ({
  rounds,
  userTeamId = '',
  onMatchClick,
  width = '100%',
  height = 480,
  disableAccessWrapper,
}) => {
  const stageRef = useRef<Konva.Stage>(null)
  const [lastCenter, setLastCenter] = useState<Vector2d | null>(null)
  const [lastDist, setLastDist] = useState<number | null>(0)
  const [activeTeam, setActiveTeam] = useState<string | null>(null)
  const [ctrlPressed, setCtrlPressed] = useState(false)
  const [metaPressed, setMetaPressed] = useState(false)
  const [showScrollReminder, setShowScrollReminder] = useState(false)
  const user = useAuth()?.user
  const router = useRouter()
  const { isMobile } = useWindowSize()
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    if (ctrlPressed || metaPressed || fullscreenHandle.active)
      PanZoom.zoomStage({ event: e, stageRef })
    else if (!showScrollReminder) {
      setShowScrollReminder(true)
      setTimeout(() => setShowScrollReminder(false), 1500)
    }
  }

  const handleTouchMove = (e: KonvaEventObject<TouchEvent>) => {
    const newValues = PanZoom.handleTouch({
      event: e,
      lastCenter,
      lastDist,
      stageRef,
    })

    setLastCenter(newValues.center)
    setLastDist(newValues.dist)
  }

  const handleTouchEnd = () => {
    setLastCenter(null)
    setLastDist(0)
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Meta') setMetaPressed(true)
    if (event.key === 'Control') setCtrlPressed(true)
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Meta') setMetaPressed(false)
    if (event.key === 'Control') setCtrlPressed(false)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, false)
    document.addEventListener('keyup', handleKeyUp, false)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
      document.removeEventListener('keyup', handleKeyUp, false)
    }
  }, [handleKeyDown, handleKeyUp])

  const fullscreenHandle = useFullScreenHandle()

  const parentSize = () => {
    if (!document) return { width: 0, height: 0 }
    const element = document.getElementById('bracketsWrapper')
    if (!element) return { width: 0, height: 0 }
    const elPos = element.getBoundingClientRect()
    return { width: elPos.width, height: elPos.height }
  }

  const [canvasSize, setCanvasSize] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  useEffect(() => {
    setCanvasSize(parentSize())
  }, [width, height])

  return (
    <AccessWrapper
      hasAccess={!showScrollReminder || disableAccessWrapper}
      title=""
      message="Use ⌘ or Ctrl + scroll to zoom"
      className={styles.scrollReminder}
    >
      <FullScreen handle={fullscreenHandle}>
        <Box
          id="bracketsWrapper"
          className={classNames(styles.stageParent, {
            [styles.fullscreen]: fullscreenHandle.active,
          })}
          sx={fullscreenHandle.active ? undefined : { width, height }}
        >
          <Box
            className={classNames(styles.floatBarContainer, {
              [styles.isMobile]: isMobile && !fullscreenHandle.active,
            })}
          >
            <Box className={styles.floatBar}>
              <Link
                passHref
                href={`/tournament/${router.query.tournamentId ?? ''}`}
              >
                <Button
                  variant="outlined"
                  startIcon={<FeedOutlined color="primary" />}
                  className={styles.floatBarButton}
                >
                  <Typography variant="labelLarge">Info Page</Typography>
                </Button>
              </Link>

              <Button
                variant="outlined"
                className={styles.floatBarButton}
                onClick={() => {
                  const anim = new Konva.Animation(function (frame) {
                    stageRef.current?.absolutePosition(
                      lerp(
                        stageRef.current?.getPosition(),
                        { x: 0, y: 0 },
                        frame
                      )
                    )
                  })

                  anim.start()
                  setTimeout(() => anim.stop(), 500)
                }}
              >
                <Typography variant="labelLarge">Me</Typography>
              </Button>
              <Button
                variant="outlined"
                className={styles.floatBarButton}
                onClick={
                  fullscreenHandle.active
                    ? fullscreenHandle.exit
                    : fullscreenHandle.enter
                }
              >
                <FullscreenOutlined color="primary" />
              </Button>
            </Box>
          </Box>
          <Stage
            ref={stageRef}
            width={
              fullscreenHandle.active ? window.innerWidth : canvasSize.width
            }
            height={
              fullscreenHandle.active ? window.innerHeight : canvasSize.height
            }
            offsetX={-50}
            draggable={!PanZoom.isTouchEnabled()}
            onWheel={handleWheel}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Layer>
              {rounds?.map((round, i) => (
                <RoundGenerator
                  key={i}
                  index={i}
                  round={round}
                  prevRound={rounds?.[i - 1]}
                  user={user as User}
                  activeTeamId={activeTeam}
                  userTeamId={userTeamId}
                  onActiveChange={(teamId) => setActiveTeam(teamId)}
                  onMatchClick={onMatchClick}
                />
              ))}
            </Layer>
          </Stage>
        </Box>
      </FullScreen>
    </AccessWrapper>
  )
}

function lerp(position: Vector2d, targetPosition: Vector2d, frame?: IFrame) {
  return {
    x:
      position.x + (targetPosition.x - position.x) * (frame?.time ?? 0) * 0.001,
    y:
      position.y + (targetPosition.y - position.y) * (frame?.time ?? 0) * 0.001,
  }
}

const space = 16

interface RoundGeneratorProps extends NodeConfig {
  prevRound?: BracketVizRound
  round?: BracketVizRound
  index: number
  user?: User
  userTeamId?: string
  activeTeamId: string | null
  onActiveChange?: (teamId: string | null) => void
  onMatchClick?: (match: Match) => void
}

const RoundGenerator = ({
  round,
  index,
  user,
  activeTeamId,
  userTeamId,
  onActiveChange,
  onMatchClick,
  prevRound,
}: RoundGeneratorProps) => {
  const cardSpacing = (index: number) => space * 2 ** index
  const cardOffset = (index: number) => (rectDim[1] / 2) * 2 ** index * 2

  const activePath = (
    matchIndex: number,
    match: Match,
    prevRound: BracketVizRound | undefined
  ): number | undefined => {
    if (!prevRound) return undefined
    const upperPrevMatch = prevRound?.matches?.[matchIndex * 2]
    const lowerPrevMatch = prevRound?.matches?.[matchIndex * 2 + 1]

    if (activeTeamInBothMatches(upperPrevMatch, match)) return 0
    if (activeTeamInBothMatches(lowerPrevMatch, match)) return 1
    return undefined
  }

  const activeTeamInBothMatches = (
    matchA: Match | undefined,
    matchB: Match
  ): boolean | undefined =>
    matchA?.teamResults?.some((a) =>
      matchB.teamResults?.some(
        (b) => b?.team?.id === a?.team?.id && a?.team?.id === activeTeamId
      )
    )

  return (
    <Group
      key={round?.id}
      x={(rectDim[0] + 100) * index}
      y={cardOffset(index) / 2 + (2 ** index - 1) * (space / 2)}
    >
      {round?.matches?.map((match, i) => (
        <Group
          key={match.id}
          x={10}
          y={cardOffset(index) * i + cardSpacing(index) * i}
        >
          <MatchNode
            key={round?.id}
            width={rectDim[0]}
            height={rectDim[1]}
            match={match}
            bestOf={round.bestOf}
            user={user}
            userTeamId={userTeamId}
            activeTeamId={activeTeamId}
            onActiveChange={onActiveChange}
            onMatchClick={onMatchClick}
          />
          {index === 0 ? null : (
            <Connector
              {...bracketDefaults.base}
              height={(cardSpacing(index - 1) + cardOffset(index - 1)) / 2}
              activePath={activePath(i, match, prevRound)}
            />
          )}
        </Group>
      ))}
    </Group>
  )
}

interface ConnectorProps extends NodeConfig {
  height: number
  activePath?: number
}

const Connector = ({ height, activePath }: ConnectorProps) => (
  <Group ref={(ref) => ref?.cache()}>
    <Line
      ref={(ref) => ref?.zIndex(activePath === 0 ? 1 : 0)}
      stroke={activePath === 0 ? styles.primary : styles.ashBlack}
      strokeWidth={4}
      lineCap="round"
      lineJoin="round"
      points={[
        -12,
        rectDim[1] / 2,
        -48,
        rectDim[1] / 2,
        -48,
        rectDim[1] / 2 - height,
        -88,
        rectDim[1] / 2 - height,
      ]}
    />
    <Line
      ref={(ref) => ref?.zIndex(activePath === 0 ? 0 : 1)}
      stroke={activePath === 1 ? styles.primary : styles.ashBlack}
      lineCap="round"
      lineJoin="round"
      strokeWidth={4}
      points={[
        -12,
        rectDim[1] / 2,
        -48,
        rectDim[1] / 2,
        -48,
        rectDim[1] / 2 + height,
        -88,
        rectDim[1] / 2 + height,
      ]}
    />
  </Group>
)

export default BracketViz
