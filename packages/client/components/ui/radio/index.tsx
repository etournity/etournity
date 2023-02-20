export * from './radio'
export * from './radioGroup'

export interface onCheckedProps {
  name: string
  value: unknown
  child?: onCheckedProps
}
