import React from 'react'
import { Dock } from '../../dock'
import { LobbyPageProps, LobbyPage } from './../../'
import { useAddToInGameMutation } from '@generated/graphql'
import { LobbyCodeInput } from '../../lobbyCodeInput'
import { Loader } from '@components/ui/loader'
import styles from './joinLobby.module.scss'
export const JoinLobby: React.FC<LobbyPageProps> = ({
  match,
  user,
  switchTo,
}) => {
  const [addToInGame] = useAddToInGameMutation({
    variables: {
      matchId: match.id,
    },
    onError: console.error,
  })
  return (
    <Dock
      match={match}
      user={user}
      phase="PRE-GAME PHASE"
      step={{
        number: 2,
        info: 'Join the lobby',
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
        title: 'DISCLAIMER',
        content:
          'Please take an in-game screenshot of the score after every game as proof.',
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
          screenshot: '/assets/instructionImages/joinRoom.png',

          info: (
            <p>
              Select &quot;Join Room&quot;
              <br />
              <br />
              Continue with Step 3.
            </p>
          ),
        },
        {
          screenshot: '/assets/instructionImages/codeInput.png',

          info: (
            <p>
              Find the room number above and enter it (see image).
              <br />
              Click on &quot;JOIN&quot;
              <br />
              Begin the match. Good Luck, Have Fun!
            </p>
          ),
        },
      ]}
    >
      {match.gameLobbyCode ? (
        <LobbyCodeInput
          readOnly
          title="Copy the code and join the lobby!"
          helpText={<p>You can copy the code by clicking on it.</p>}
          id="lobbycode"
          value={`${match.gameLobbyCode}`}
          maxLength={7}
          size={7}
          buttonOnClick={() =>
            addToInGame().then(() => switchTo(LobbyPage.Scores))
          }
          onClick={(e) => {
            e.currentTarget.select()
            document.execCommand('copy')
          }}
        />
      ) : (
        <LobbyCodeInput
          title="Copy the code and join the lobby!"
          insteadInput={
            <div className={styles.waiting}>
              <Loader color="black" />
              <span>Waiting for opponent to submit code.</span>
            </div>
          }
          helpText={<p>Click the code to copy it to the clipboard.</p>}
          showButton={false}
        />
      )}
    </Dock>
  )
}
