declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.sass' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.styl' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.scss' {
  const classes: Record<string, string>
  export default classes
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>
declare module '*.svg'
declare module '*.png'
