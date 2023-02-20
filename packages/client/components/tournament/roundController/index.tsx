import { Round, TournamentStatus } from "@generated/graphql";
import React from "react";
import { PartialDeep } from "type-fest";
import { RoundSteps, RoundStep } from "../roundSteps";
import styles from "./roundController.module.scss";
import classNames from "classnames";

export interface RoundControllerProps {
  rounds: Array<PartialDeep<Round>>;
  onChange: (change: RoundStatusChange) => void;
  className?: string;
  tournamentStatus: TournamentStatus;
}

export interface RoundStatusChange {
  roundId?: string;
  change: "locked" | "unlocked";
}

export const RoundController: React.FC<RoundControllerProps> = ({
  rounds,
  onChange,
  className,
  tournamentStatus,
}) => (
  <div className={classNames(styles.roundController, className)}>
    <div className={styles.title}>Round Controller</div>
    <div className={styles.controllerWrap}>
      <div className={styles.leftGradiant} />
      <div className={styles.stepsDiv}>
        <div className={styles.gradientSpacingDiv}></div>
        <RoundSteps tournamentStatus={tournamentStatus} onChange={onChange}>
          {[...rounds]
            ?.sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
            .map((round) => (
              <RoundStep
                key={round?.id}
                number={round.number}
                status={round.status}
                locked={round.locked}
                matchesCount={round.matches?.length}
                matchesDone={round.completedMatches}
                id={round.id}
              />
            ))}
        </RoundSteps>
        <div className={styles.gradientSpacingDiv} />
      </div>
      <div className={styles.rightGradiant} />
      <div className={styles.text}>
        <div>Round 1</div>
        <div>Round {rounds.length}</div>
      </div>
    </div>
  </div>
);
