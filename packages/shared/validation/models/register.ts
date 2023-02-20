import * as Yup from 'yup'

const tournamentRegisterValidation = {
  inGameName: Yup.string()
    .min(2, 'Your InGameName has to be longer than 2 characters.')
    .max(20, 'Your InGameName should be less than 20 characters long.')
    .required('You have to provide an InGameName.'),
  elo: Yup.number()
    .typeError('Elo has to be a number!')
    .min(200, 'Your elo has to be at least 200.')
    .max(9999, 'Your elo must not be bigger than 9999.')
    .required('You have to provide your elo.'),
}

export const tournamentRegisterSchema = {
  client: Yup.object().shape(tournamentRegisterValidation),
  server: Yup.object().shape(tournamentRegisterValidation),
}
