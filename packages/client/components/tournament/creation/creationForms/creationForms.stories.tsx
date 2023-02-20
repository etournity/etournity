import React, { useState } from 'react'
import { Story } from '@storybook/react'
import { GameInformationForm } from './gameInformationForm'
import { CreationFormCard } from '../creationFormCard'
import styles from './creationForms.module.scss'
import { GeneralInformationForm } from './generalInformationForm'
import { PlatformForm } from './platformForm'
import { AdditionalInformationForm } from './additionalInformationForm'
import { DescriptionForm } from './descriptionForm'
import { RulesetForm } from './rulesetForm'
import { OptionalInformationForm } from './optionalInformation'
import { TimetableForm } from './timetableForm'
import { CreationFormValues } from '@pages/tournament/new'

export default {
  title: 'Components/Tournament/CreationForms',
}

export const All: Story = () => {
  const [formValues, setFormValues] = useState<CreationFormValues>({
    gameInformation: {
      game: null,
      gameMode: null,
    },
    generalInformation: {
      title: '',
      maxPlayers: 0,
      maxTeams: 0,
      type: null,
    },
    platforms: [],
    additionalInformation: {
      language: null,
      region: null,
      discordSupportLink: '',
    },
    description: '<p><br></p>',
    ruleset: '<p><br></p>',
    optionalInformation: {
      prizePool: '',
      streamLink: '',
    },
    timetable: {
      checkInStart: null,
      checkInEnd: null,
      plannedStart: null,
    },
  })

  return (
    <div className={styles.wrapper}>
      <div>
        <CreationFormCard title="Game Information">
          <GameInformationForm
            gameModes={[]}
            value={formValues.gameInformation}
            onChange={(value) =>
              setFormValues({ ...formValues, gameInformation: value })
            }
          />
        </CreationFormCard>
        <CreationFormCard title="General Information">
          <GeneralInformationForm
            gameMode={{
              id: '1',
              title: '1 v 1',
              value: 1,
            }}
            value={formValues.generalInformation}
            onChange={(value) =>
              setFormValues({ ...formValues, generalInformation: value })
            }
          />
        </CreationFormCard>
      </div>
      <div>
        <CreationFormCard title="Platform">
          <PlatformForm
            platforms={[
              { code: 'pc', name: 'PC' },
              { code: 'switch', name: 'Switch' },
              { code: 'mobile', name: 'Mobile' },
              { code: 'xbox', name: 'XBOX' },
              { code: 'playstation', name: 'PlayStation' },
            ]}
            value={formValues.platforms}
            onChange={(value) =>
              setFormValues({ ...formValues, platforms: value })
            }
          />
        </CreationFormCard>
        <CreationFormCard title="Additional Information">
          <AdditionalInformationForm
            value={formValues.additionalInformation}
            onChange={(value) =>
              setFormValues({ ...formValues, additionalInformation: value })
            }
          />
        </CreationFormCard>
        <CreationFormCard title="Timetable">
          <TimetableForm
            value={formValues.timetable}
            onChange={(value) =>
              setFormValues({ ...formValues, timetable: value })
            }
          />
        </CreationFormCard>
      </div>
      <div>
        <CreationFormCard title="Description">
          <DescriptionForm
            value={formValues.description}
            onChange={(value) =>
              setFormValues({ ...formValues, description: value })
            }
          />
        </CreationFormCard>
        <CreationFormCard title="Tournament Ruleset">
          <RulesetForm
            value={formValues.ruleset}
            onChange={(value) =>
              setFormValues({ ...formValues, ruleset: value })
            }
          />
        </CreationFormCard>
        <CreationFormCard title="Optional Information">
          <OptionalInformationForm
            value={formValues.optionalInformation}
            onChange={(value) =>
              setFormValues({ ...formValues, optionalInformation: value })
            }
          />
        </CreationFormCard>
      </div>
      <pre style={{ fontSize: 12 }}>{JSON.stringify(formValues, null, 2)}</pre>
    </div>
  )
}
