import * as Yup from 'yup'
import dayjs from 'dayjs'

const clientCreateTournamentValidation = {
  gameInformation: Yup.object().shape({
    game: Yup.object()
      .typeError('Please select a game.')
      .required('Please select a game.'),
    gameMode: Yup.object()
      .typeError('Please select a game mode.')
      .required('Please select a game mode.'),
  }),
  generalInformation: Yup.object().shape({
    title: Yup.string()
      .required('Please provide a title.')
      .min(5, 'Choose a title that is at least 5 characters long.')
      .max(32, 'This is supposed to be a title, not a novel! (32 Characters)'),
    type: Yup.string()
      .typeError('Please choose a tournament mode.')
      .required('Please choose a tournament mode.'),
    maxPlayers: Yup.number()
      .min(2, 'You need at least 2 players to create a tournament.')
      .max(64, 'You cannot have more than 64 players in a tournament.'),
    maxTeams: Yup.number()
      .min(2, 'You need at least 2 teams to create a tournament.')
      .max(64, 'You cannot have more than 64 teams in a tournament.'),
  }),
  bestOf: Yup.array(),
  platforms: Yup.array().min(1, 'You need at least one platform.'),
  additionalInformation: Yup.object().shape({
    language: Yup.object()
      .typeError('Please choose a language.')
      .required('Please choose a language.'),
    region: Yup.object()
      .typeError('Please choose a region.')
      .required('Please choose a region.'),
    discordSupportLink: Yup.string()
      .required('Please provide a link to the Discord Support Server.')
      .matches(
        /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/,
        'Please provide a valid link to the Discord Support Server.'
      ),
  }),
  timetable: Yup.object().shape({
    checkInStart: Yup.date()
      .required('please provide a check in start date.')
      .typeError('Please provide a valid check-in start date.')
      .min(
        new Date(),
        'Please provide a check-in start date that is in the future.'
      ),
    checkInEnd: Yup.date()
      .required('please provide a check in end date.')
      .typeError('Please provide a valid check-in end date.')
      .when(
        'checkInStart',
        (
          start: Date | null,
          yup: Yup.DateSchema<Date | undefined, Record<string, unknown>>
        ) =>
          isValidDate(start)
            ? yup.min(
                dayjs(start).add(5, 'minutes').toDate(),
                'Please provide a checkInEnd date that is at least 5 minutes after the check-in-start date.'
              )
            : yup
      )
      .when(
        'checkInStart',
        (
          start: Date | null,
          yup: Yup.DateSchema<Date | undefined, Record<string, unknown>>
        ) =>
          isValidDate(start)
            ? yup.max(
                dayjs(start).add(1, 'hour').toDate(),
                'Please provide a check-in end date that is at most an hour after the check-in start date.'
              )
            : yup
      ),
    plannedStart: Yup.date()
      .required('please provide a planned start date.')
      .typeError('Please provide a valid planned start date.')
      .when(
        'checkInEnd',
        (
          end: Date | null,
          yup: Yup.DateSchema<Date | undefined, Record<string, unknown>>
        ) =>
          isValidDate(end)
            ? yup.min(
                dayjs(end).subtract(1, 'second').toDate(),
                'Please provide a planned start date that is after the check-in end date.'
              )
            : yup
      ),

    noShow: Yup.number()
      .typeError('Please provide a Match Disqualify Time')
      .required('Please provide a Match Disqualify Time')
      .max(60, 'The Maximum for the Disqualify Time is 60')
      .min(0),
  }),
  description: Yup.string()
    .min(20, 'Please provide a description with at least 20 characters.')
    .max(20000, 'Please keep your description shorter.'),
  ruleset: Yup.string()
    .min(20, 'Please provide a ruleset with at least 20 characters.')
    .max(20000, 'Please dont make your participants read a novel.'),

  optionalInformation: Yup.object().shape({
    streamLink: Yup.string().url(
      'Please provide a valid link to a streaming platform.'
    ),
    prizePool: Yup.string().max(
      80,
      "Woah, that's too big! Please limit yourself to 80 characters."
    ),
  }),
}

const serverCreateTournamentValidation = {
  gameId: Yup.string()
    .typeError('Please select a game.')
    .required('Please select a game.'),
  gameModeId: Yup.string()
    .typeError('Please select a game mode.')
    .required('Please select a game mode.'),
  title: Yup.string()
    .required('Please provide a title.')
    .min(5, 'Choose a title that is at least 5 characters long.')
    .max(50, 'This is supposed to be a title, not a novel! (50 Characters)'),
  type: Yup.string()
    .typeError('Please choose a tournament mode.')
    .required('Please choose a tournament mode.'),
  maxPlayers: Yup.number()
    .min(2, 'You need at least 2 players to create a tournament.')
    .max(64, 'You cannot have more than 64 players in a tournament.'),
  maxTeams: Yup.number()
    .min(2, 'You need at least 2 teams to create a tournament.')
    .max(64, 'You cannot have more than 64 teams in a tournament.'),
  bestOf: Yup.array(),
  platforms: Yup.array().min(1, 'You need at least one platform.'),
  language: Yup.string()
    .typeError('Please choose a language.')
    .required('Please choose a language.'),
  region: Yup.string()
    .typeError('Please choose a region.')
    .required('Please choose a region.'),
  supportLink: Yup.string()
    .required('Please provide a link to the Discord Support Server.')
    .matches(
      /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/,
      'Please provide a valid link to the Discord Support Server.'
    ),
  checkinStart: Yup.date()
    .required('please provide a check in start date.')
    .typeError('Please provide a valid check-in start date.')
    .min(
      new Date(),
      'Please provide a check-in start date that is in the future.'
    ),
  checkinEnd: Yup.date()
    .required('please provide a check in end date.')
    .typeError('Please provide a valid check-in end date.')
    .when(
      'checkInStart',
      (
        start: Date | null,
        yup: Yup.DateSchema<Date | undefined, Record<string, unknown>>
      ) =>
        isValidDate(start)
          ? yup.min(
              dayjs(start).add(5, 'minutes').toDate(),
              'Please provide a checkInEnd date that is at least 5 minutes after the check-in-start date.'
            )
          : yup
    )
    .when(
      'checkInStart',
      (
        start: Date | null,
        yup: Yup.DateSchema<Date | undefined, Record<string, unknown>>
      ) =>
        isValidDate(start)
          ? yup.max(
              dayjs(start).add(1, 'hour').toDate(),
              'Please provide a check-in end date that is at most an hour after the check-in start date.'
            )
          : yup
    ),
  date: Yup.date()
    .required('please provide a planned start date.')
    .typeError('Please provide a valid planned start date.')
    .min(
      Yup.ref('checkinEnd'),
      'Please provide a planned start date that is after the check-in end date.'
    ),
  noShow: Yup.number()
    .typeError('Please provide a Match Disqualify Time')
    .required('Please provide a Match Disqualify Time')
    .max(60, 'The Maximum for the Disqualify Time is 60')
    .min(0),
  description: Yup.string()
    .min(20, 'Please provide a description with at least 20 characters.')
    .max(
      9007199254740991,
      "Please don't surpass the javascript string length limit or I will take away your eyeballs."
    ),
  rules: Yup.string()
    .min(20, 'Please provide a ruleset with at least 20 characters.')
    .max(
      9007199254740991,
      "Please don't surpass the javascript string length limit or I will take away your eyeballs."
    ),
  streamLink: Yup.string().url(
    'Please provide a valid link to a streaming platform.'
  ),
  prizePool: Yup.string(),
}

export const createTournamentSchema = {
  client: clientCreateTournamentValidation,
  server: Yup.object().shape({
    data: Yup.object().shape(serverCreateTournamentValidation),
  }),
}

function isValidDate(date: Date | null) {
  return date instanceof Date && !isNaN(date.getTime())
}
