import * as Yup from 'yup'

const clientCreateGameValidation = {
  title: Yup.string().required('Names! Give us names!'),
  homepage: Yup.string().url('This should be a URL'),
}

export const createGameSchema = {
  client: Yup.object().shape(clientCreateGameValidation),
  server: Yup.object().shape({
    data: Yup.object(clientCreateGameValidation),
  }),
}
