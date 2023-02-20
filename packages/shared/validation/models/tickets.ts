import * as yup from 'yup'

enum TicketType {
  GameIssue = 'GAME_ISSUE',
  PlayerNotResponding = 'PLAYER_NOT_RESPONDING',
  PlayerReport = 'PLAYER_REPORT',
  ScoreConflict = 'SCORE_CONFLICT',
  SiteIssue = 'SITE_ISSUE',
}

const clientCreateTicketValidation = {
  description: yup.string().required('What happened?'),
  ticketType: yup
    .mixed<TicketType | null>()
    .nullable()
    .transform((value) =>
      value === null
        ? undefined
        : Object.values(TicketType).includes(value)
        ? value
        : 'wrong'
    )
    .required('What type of problem do you have?')
    .oneOf(
      Object.values(TicketType),
      "You weren't supposed to get here, you know?"
    ),
  player: yup
    .object()
    .nullable()
    .when('ticketType', {
      is: (value) =>
        [TicketType.PlayerReport, TicketType.PlayerNotResponding].includes(
          value
        ),
      then: yup.object().nullable().required('Who do you want to report?'),
    }),
}

const serverCreateTicketValidation = {
  message: clientCreateTicketValidation.description,
  ticketType: clientCreateTicketValidation.ticketType,
  reporterId: yup.string().required(),
  reportedId: yup.string().when('ticketType', {
    is: (value) =>
      [TicketType.PlayerReport, TicketType.PlayerNotResponding].includes(value),
    then: yup.string().required(),
  }),
  tournamentId: yup.string(),
}

export const createTicketSchema = {
  client: yup.object().shape(clientCreateTicketValidation),
  server: yup.object().shape(serverCreateTicketValidation),
}

const clientResolveTicketValidation = {
  action: yup.string().required('Select an action!'),
  verdict: yup.string(),
}

export const resolveTicketSchema = {
  client: yup.object().shape(clientResolveTicketValidation),
}
