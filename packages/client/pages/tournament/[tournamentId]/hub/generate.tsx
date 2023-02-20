import { Button } from '@components/ui/button'
import { Loader } from '@components/ui/loader'
import { Empty } from '@components/ui/empty'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { ReactElement, useEffect, useState } from 'react'
import { useGenerateBrackets } from 'hooks/generateBrackets'
import styles from './generate.module.scss'
import { ErrorResult } from '@components/results/errorResult'
import Link from 'next/link'
import { ConfirmationModal } from '@components/ui/confirmationModal'

const BracketViz = dynamic(() => import('@components/tournament/bracketViz'), {
  ssr: false,
})

enum GenerationAlgorithm {
  SEED = 'seed',
  RANDOM = 'random',
}

const GenerateBrackets = () => {
  const router = useRouter()
  const tournamentId = (router.query.tournamentId as string) || ''
  const {
    generateBrackets,
    publishBrackets,
    rounds,
    loading,
    error,
    generationAllowed,
  } = useGenerateBrackets(tournamentId)

  const [activeAlgorithm, setActiveAlgorithm] = useState<GenerationAlgorithm>(
    GenerationAlgorithm.SEED
  )
  const [bestOfs, setBestOfs] = useState<
    Array<{ roundId: string; bestOf: number }>
  >([])

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const generateBracketWithAlgorithm = (algorithm: GenerationAlgorithm) => {
    if (tournamentId && !loading && !error) generateBrackets(algorithm)
  }

  const changeAlgorithm = (
    algorithm: GenerationAlgorithm,
    loading: boolean
  ) => {
    if (
      !(
        algorithm === GenerationAlgorithm.SEED &&
        activeAlgorithm === GenerationAlgorithm.SEED
      ) &&
      !loading
    ) {
      setActiveAlgorithm(algorithm)
      generateBracketWithAlgorithm(algorithm)
    }
  }

  useEffect(() => {
    if (!rounds && !loading) generateBrackets()
  }, [rounds, loading, generateBrackets])

  if (!generationAllowed || (!loading && error))
    return (
      <ErrorResult
        hideReportButton
        title="Can't generate brackets now!"
        description={
          (rounds?.length ?? 0) < 1
            ? 'Not enough eligible players to generate brackets.'
            : 'You can generate brackets after the check-in is done.'
        }
        customActions={
          <Link
            key="backHub"
            passHref
            href={`/tournament/${router.query.tournamentId ?? ''}/hub`}
          >
            <Button>Return to Hub</Button>
          </Link>
        }
      />
    )

  if (!loading && error) return <Empty description="Could not load brackets." />

  return (
    <div className={styles.bracketGen}>
      <div className={styles.generationBar}>
        <div className={styles.seed}>
          <Link
            passHref
            href={`/tournament/${router.query.tournamentId ?? ''}/hub`}
          >
            <Button variant="secondary">Back to the Hub</Button>
          </Link>
          <div className={styles.generationAlgorithms}>
            <span className={styles.sectionTitle}>
              CHOOSE TYPE OF SEED GENERATION
            </span>
            <div className={styles.algorithmSelector}>
              <GenerationAlgorithmCard
                tag="recommended"
                active={activeAlgorithm === GenerationAlgorithm.SEED}
                title="ELO BASED"
                content={
                  <ol>
                    <li>The seed will be set according to elo</li>
                    <li>High elo players will meet near the end</li>
                  </ol>
                }
                onClick={() =>
                  changeAlgorithm(GenerationAlgorithm.SEED, loading)
                }
              />
              <GenerationAlgorithmCard
                tag="experimental"
                active={activeAlgorithm === GenerationAlgorithm.RANDOM}
                title="RANDOM"
                content={
                  <ol>
                    <li>Embrace chaos</li>
                    <li>Nothing makes sense</li>
                    <li>Click again to repeat</li>
                  </ol>
                }
                onClick={() =>
                  changeAlgorithm(GenerationAlgorithm.RANDOM, loading)
                }
              />
              <div className={styles.verticalDivider} />
              <div className={styles.generationCard}>
                <span>&nbsp;</span>
                <div className={styles.disabled}>
                  <p>CUSTOM</p>
                  <p>
                    Coming soon! <br /> This feature is still being built.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              setModalOpen(true)
            }}
          >
            Publish Brackets
          </Button>
        </div>
        <div className={styles.horizontalDivider} />
        {rounds && (
          <div className={styles.bestOf}>
            <span className={styles.sectionTitle}>CHOOSE ROUND FORMATS</span>
            <div className={styles.bestOfSelectors}>
              {rounds?.map((round, i) => (
                <div key={round.id} className={styles.round}>
                  <span className={styles.roundTitle}>
                    {i === rounds.length - 1
                      ? 'Final'
                      : i === rounds.length - 2
                      ? 'Semi-Final'
                      : `Round ${round.number}`}
                  </span>
                  <select
                    className={styles.select}
                    value={
                      bestOfs.length
                        ? bestOfs.find((bestOf) => bestOf.roundId === round.id)
                            ?.bestOf
                        : round.bestOf
                    }
                    onChange={(v) => {
                      const newValues = bestOfs.length
                        ? bestOfs.map((bestOf) =>
                            bestOf.roundId === round.id
                              ? {
                                  roundId: bestOf.roundId,
                                  bestOf: parseInt(v.target.value, 10),
                                }
                              : bestOf
                          )
                        : rounds.map((bestOf) =>
                            bestOf.id && bestOf.id === round.id
                              ? {
                                  roundId: bestOf.id,
                                  bestOf: parseInt(v.target.value, 10),
                                }
                              : {
                                  roundId: bestOf.id ?? '',
                                  bestOf: bestOf.bestOf,
                                }
                          )
                      setBestOfs(newValues)
                    }}
                  >
                    <option value={1}>Bo1</option>
                    <option value={3}>Bo3</option>
                    <option value={5}>Bo5</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className={styles.dataHandler}>
          <Loader size={4} strokeWidth={0.375} />
          <h3>Generating Bracket...</h3>
        </div>
      ) : (
        <BracketViz rounds={rounds} />
      )}
      <ConfirmationModal
        hideFlag
        active={modalOpen}
        title="Publish Brackets?"
        description="You won't be able to change these settings after publishing!"
        primaryBtnName="Publish"
        onPrimary={() =>
          publishBrackets(bestOfs).then(() =>
            router.push(`/tournament/${router.query.tournamentId ?? ''}/hub`)
          )
        }
        onCancel={() => setModalOpen(false)}
      />
    </div>
  )
}

export default GenerateBrackets

interface GenerationAlgorithmCardProps {
  tag: string
  title: string
  content: ReactElement
  active: boolean
  onClick: () => void
}

const GenerationAlgorithmCard: React.FC<GenerationAlgorithmCardProps> = ({
  tag,
  title,
  content,
  active,
  onClick,
}) => (
  <div className={styles.generationCard}>
    <span>{tag}</span>
    <div
      className={classNames({
        [styles.active]: active,
      })}
      onClick={onClick}
    >
      <p>{title}</p>
      {content}
    </div>
  </div>
)
