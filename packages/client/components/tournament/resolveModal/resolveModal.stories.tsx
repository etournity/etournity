import React, { useState } from 'react'
import { ResolveModal, ResolveModalProps } from '.'
import { Button } from '@components/ui/button'
import { Story } from '@storybook/react'
import { TicketType, Ticket } from '@generated/graphql'

export default {
  title: 'Components/Tournament/ResolveModal',
  component: ResolveModal,
}

export const ExampleResolveModal: Story<ResolveModalProps> = ({ ticket }) => {
  const [active, setActive] = useState(false)
  return (
    <>
      <div
        style={{
          height: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#1c1c1c',
        }}
      >
        <Button onClick={() => setActive(!active)}>Open Modal</Button>
      </div>
      <ResolveModal
        active={active}
        ticket={ticket}
        onClose={() => setActive(false)}
      >
        <span>Form goes here</span>
      </ResolveModal>
    </>
  )
}

ExampleResolveModal.args = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  ticket: {
    type: TicketType.ScoreConflict,
    match: {
      opponents: [
        {
          id: 'c000000000000000000team1',
          name: 'Team 1',
        },
        {
          id: 'c000000000000000000team2',
          name: 'Team 2',
        },
      ],
      matchGames: [
        {
          id: '1111',
          submissions: [
            {
              id: 'ckrkglsio1175kalvbbeo56ia',
              teamId: 'c000000000000000000team1',
              matchGame: {
                number: 1,
              },
              results: [
                {
                  teamId: 'c000000000000000000team1',
                  score: 1,
                },
                {
                  teamId: 'c000000000000000000team2',
                  score: 0,
                },
              ],
            },
            {
              id: 'ckrkglwmj1432kalvo416peer',
              teamId: 'c000000000000000000team2',
              matchGame: {
                number: 1,
              },
              results: [
                {
                  teamId: 'c000000000000000000team1',
                  score: 0,
                },
                {
                  teamId: 'c000000000000000000team2',
                  score: 1,
                },
              ],
            },
          ],
        },
        {
          id: '2222',
          submissions: [
            {
              id: 'ckrkglsi51155kalvr0whxxwu',
              teamId: 'c000000000000000000team1',
              matchGame: {
                number: 2,
              },
              results: [
                {
                  teamId: 'c000000000000000000team1',
                  score: 1,
                },
                {
                  teamId: 'c000000000000000000team2',
                  score: 0,
                },
              ],
            },
            {
              id: 'ckrkglwo41470kalvr5bslkxj',
              teamId: 'c000000000000000000team2',
              matchGame: {
                number: 2,
              },
              results: [
                {
                  teamId: 'c000000000000000000team1',
                  score: 0,
                },
                {
                  teamId: 'c000000000000000000team2',
                  score: 1,
                },
              ],
            },
          ],
        },
        {
          id: '3333',
          submissions: [
            {
              id: 'ckrkglshw1139kalv3n5yyuqx',
              teamId: 'c000000000000000000team1',
              matchGame: {
                number: 3,
              },
              results: [
                {
                  teamId: 'c000000000000000000team1',
                  score: 0,
                },
                {
                  teamId: 'c000000000000000000team2',
                  score: 0,
                },
              ],
            },
            {
              id: 'ckrkglwnf1451kalvjwhq13ub',
              teamId: 'c000000000000000000team2',
              matchGame: {
                number: 3,
              },
              results: [
                {
                  teamId: 'c000000000000000000team1',
                  score: 0,
                },
                {
                  teamId: 'c000000000000000000team2',
                  score: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  } as Ticket,
}
