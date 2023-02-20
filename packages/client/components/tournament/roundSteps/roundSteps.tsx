import React, { ReactElement } from 'react'
import { RoundStepProps } from './roundStep'
import styles from './roundSteps.module.scss'
import { RoundAction, RoundActionVariant } from '../roundAction'
import { RoundStatus, TournamentStatus } from '@generated/graphql'
import { RoundStatusChange } from '../roundController'

export interface RoundStepsProps {
  children: Array<ReactElement<RoundStepProps>>
  onChange: (change: RoundStatusChange) => void
  tournamentStatus: TournamentStatus
}

export const RoundSteps: React.FC<RoundStepsProps> = ({
  children,
  onChange,
}) => (
  <div className={styles.roundSteps}>
    {children?.map((child, i) => {
      const currentRound: RoundStepProps | undefined = children[i]?.props

      const currentRoundDone = currentRound?.status === RoundStatus.Completed

      const currentRoundActive = currentRound?.status === RoundStatus.Active

      return (
        <React.Fragment key={child.key}>
          {i > 0 && currentRound ? (
            <RoundAction
              status={
                child.props.locked
                  ? currentRoundActive
                    ? RoundActionVariant.ACTIVELOCKED
                    : RoundActionVariant.LOCKED
                  : currentRoundDone
                  ? RoundActionVariant.DONE
                  : currentRoundActive
                  ? RoundActionVariant.ACTIVE
                  : RoundActionVariant.UNLOCKED
              }
              onChange={(variant) =>
                onChange({ roundId: child.props.id, change: variant })
              }
            />
          ) : null}
          <child.type {...child.props} />
        </React.Fragment>
      )
    })}
  </div>
)
