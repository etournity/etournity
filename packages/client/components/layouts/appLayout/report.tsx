import React from 'react'
import styles from './report.module.scss'
import { Tooltip } from '@components/ui/tooltip'
import { useGlobalReportContext } from '@state/globalReportModal'

interface ReportProps {
  tournamentId?: string
}
const Report: React.FC<ReportProps> = ({ tournamentId }) => {
  const { openModal } = useGlobalReportContext()

  return (
    <div className={styles.reportWrapper}>
      <Tooltip
        content={
          <span className={styles.tooltipContent}>
            Report a problem to the organizer
          </span>
        }
        placement="left"
        className={styles.reportTooltip}
      >
        <div className={styles.report} onClick={() => openModal(tournamentId)}>
          <img height={24} width={24} src="/assets/icons/flag.png" />
        </div>
      </Tooltip>
    </div>
  )
}

export default Report
