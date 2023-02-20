import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps, LobbyPage } from './../../'
import { Formik } from 'formik'
import { useAddLobbyCodeMutation } from '@generated/graphql'
import styles from './createLobby.module.scss'
import * as Yup from 'yup'
import { LobbyCodeInput } from '../../lobbyCodeInput'

export const CreateLobby: React.FC<LobbyPageProps> = ({
  match,
  user,
  switchTo,
}) => {
  const [addLobbyCode] = useAddLobbyCodeMutation({
    onCompleted: (data) => {
      if (data.addLobbyCode) {
        switchTo(LobbyPage.JoinLobby)
      }
    },
    onError: console.error,
  })
  const lobbyCodeSchema = Yup.object({
    lobbycode: Yup.string()
      .length(6, 'Lobby code must be 6 chars long!')
      // Checks for digits only
      .matches(/^\d*$/g, 'Please enter a valid lobby code!'),
  })
  const handleSubmit = ({ lobbycode }: { lobbycode: string }) => {
    addLobbyCode({
      variables: {
        matchId: match.id,
        lobbycode,
      },
    })
  }

  return (
    <Dock
      match={match}
      user={user}
      phase="PRE-GAME PHASE"
      step={{
        number: 2,
        info: 'Create an in-game lobby',
      }}
      creator={{
        description: match.gameLobbyCode ? 'code sent' : 'creating lobby',
        icon: { variant: 'send' },
        progress: match.gameLobbyCode ? 'done' : 'waiting',
      }}
      guest={{
        description: match.gameLobbyCode ? 'code received' : 'waiting for code',
        icon: { variant: 'receive' },
        progress: match.gameLobbyCode ? 'done' : 'waiting',
      }}
      disclaimer={{
        title: 'IMPORTANT',
        content:
          'Please make an in-game screenshot of the score after every game as proof.',
      }}
      instructions={[
        {
          screenshot: '/assets/instructionImages/customRoom.png',
          info: (
            <p>
              In the Main Menu:
              <br />
              Click on &quot;Custom Game Room&quot;
              <br />
              <br />
              Continue with Step 2.
            </p>
          ),
        },
        {
          screenshot: '/assets/instructionImages/createRoom.png',
          info: (
            <p>
              Select &quot;Create Room&quot;.
              <br />
              <br />
              Continue with Step 3.
            </p>
          ),
        },
        {
          screenshot: '/assets/instructionImages/privateRoom.png',
          info: (
            <p>
              Select &quot;Private Room&quot;.
              <br />
              <br />
              Continue with Step 4.
            </p>
          ),
        },
        {
          screenshot: '/assets/instructionImages/settings.png',

          info: (
            <p>
              Now you need to change the lobby settings.
              <br />
              On the top of your screen, click on &quot;SETTINGS&quot; or press
              &quot;X&quot;.
              <br />
              Continue with Step 5.
            </p>
          ),
        },
        {
          screenshot: '/assets/instructionImages/lobbyOptions.png',

          info: (
            <p>
              1. Select &quot;Lobby&quot;
              <br />
              2. Select &quot;1 v 1&quot;
              <br />
              3. Select the region. You can find the correct one in the
              Tournament Info Page.
              <br />
              4. Click &quot;Confirm&quot; or press &quot;C&quot;
              <br />
              Continue with Step 6.
            </p>
          ),
        },
        {
          screenshot: '/assets/instructionImages/roomCode.png',

          info: (
            <p>
              Find the Room number near the top of your screen.
              <br />
              <br />
              Enter the Room number in the input field above.
            </p>
          ),
        },
      ]}
    >
      <Formik
        initialValues={{ lobbycode: match.gameLobbyCode || '' }}
        validationSchema={lobbyCodeSchema}
        onSubmit={handleSubmit}
      >
        {({
          submitForm,
          handleChange,
          values,
          errors,
          isValid,
          setFieldError,
        }) => (
          <LobbyCodeInput
            title="Enter your lobby code!"
            type="text"
            name="lobbycode"
            placeholder="123456"
            maxLength={6}
            size={6}
            value={values.lobbycode}
            helpText={<h5 className={styles.inputError}>{errors.lobbycode}</h5>}
            buttonOnClick={async () => {
              if (isValid && values.lobbycode) {
                await submitForm()
              } else {
                setFieldError('lobbycode', 'Please enter a valid lobby code!')
              }
            }}
            onChange={handleChange}
          />
        )}
      </Formik>
    </Dock>
  )
}
