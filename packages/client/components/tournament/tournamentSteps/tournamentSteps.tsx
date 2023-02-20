import React, { ReactElement } from 'react'
import { StepProps } from './step'
import styles from './tournamentSteps.module.scss'

export interface TournamentStepsProps {
  children: Array<ReactElement<StepProps>>
  activeStep: number
}

export const TournamentSteps: React.FC<TournamentStepsProps> = ({
  children,
  activeStep,
}) => (
  <div className={styles.tournamentSteps}>
    {children.map((child, i) => (
      <child.type
        key={i}
        {...child.props}
        variant={
          child.props.variant ?? i === activeStep
            ? 'active'
            : i < activeStep
            ? 'done'
            : 'upcoming'
        }
        number={child.props.number ?? i + 1}
      />
    ))}
  </div>
)
