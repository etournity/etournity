import { createTheme, responsiveFontSizes } from '@mui/material'

const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0, // Smollest
      sm: 600, // Small
      md: 905, // Medium
      lg: 1240, // DesktopSmall
      xl: 1440, // DesktopBig
    },
  },
})

const customShadows = [
  '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
  '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)',
  '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
  '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
  '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
]

const shadowArray = defaultTheme.shadows.concat(
  customShadows
) as typeof defaultTheme.shadows

declare module '@mui/material' {
  interface Palette {
    color: {
      color: string
      primary: string
      onPrimary: string
      primaryContainer: string
      onPrimaryContainer: string
      secondary: string
      onSecondary: string
      secondaryContainer: string
      onSecondaryContainer: string
      tertiary: string
      onTertiary: string
      tertiaryContainer: string
      onTertiaryContainer: string
      error: string
      errorContainer: string
      onError: string
      onErrorContainer: string
      background: string
      onBackground: string
      surface: string
      onSurface: string
      surfaceVariant: string
      onSurfaceVariant: string
      surface1: string
      surface2: string
      surface3: string
      surface4: string
      surface5: string
      outline: string
      inverseOnSurface: string
      inverseSurface: string
      inversePrimary: string
      white: string
      black: string
    }
  }

  interface PaletteOptions {
    color: {
      color?: string
      primary?: string
      onPrimary?: string
      primaryContainer?: string
      onPrimaryContainer?: string
      secondary?: string
      onSecondary?: string
      secondaryContainer?: string
      onSecondaryContainer?: string
      tertiary?: string
      onTertiary?: string
      tertiaryContainer?: string
      onTertiaryContainer?: string
      error?: string
      errorContainer?: string
      onError?: string
      onErrorContainer?: string
      background?: string
      onBackground?: string
      surface?: string
      onSurface?: string
      surfaceVariant?: string
      onSurfaceVariant?: string
      surface1?: string
      surface2?: string
      surface3?: string
      surface4?: string
      surface5?: string
      outline?: string
      inverseOnSurface?: string
      inverseSurface?: string
      inversePrimary?: string
      white?: string
      black?: string
    }
  }
}

declare module '@mui/material' {
  interface TypographyVariants {
    label: React.CSSProperties
    labelSmall: React.CSSProperties
    labelMedium: React.CSSProperties
    labelLarge: React.CSSProperties

    body: React.CSSProperties
    bodySmall: React.CSSProperties
    bodyMedium: React.CSSProperties
    bodyLarge: React.CSSProperties

    display: React.CSSProperties
    displaySmall: React.CSSProperties
    displayMedium: React.CSSProperties
    displayLarge: React.CSSProperties

    headline: React.CSSProperties
    headlineSmall: React.CSSProperties
    headlineMedium: React.CSSProperties
    headlineLarge: React.CSSProperties

    title: React.CSSProperties
    titleSmall: React.CSSProperties
    titleMedium: React.CSSProperties
    titleLarge: React.CSSProperties
  }
  interface TypographyVariantsOptions {
    label?: React.CSSProperties
    labelSmall?: React.CSSProperties
    labelMedium?: React.CSSProperties
    labelLarge?: React.CSSProperties

    body?: React.CSSProperties
    bodySmall?: React.CSSProperties
    bodyMedium?: React.CSSProperties
    bodyLarge?: React.CSSProperties

    display?: React.CSSProperties
    displaySmall?: React.CSSProperties
    displayMedium?: React.CSSProperties
    displayLarge?: React.CSSProperties

    headline?: React.CSSProperties
    headlineSmall?: React.CSSProperties
    headlineMedium?: React.CSSProperties
    headlineLarge?: React.CSSProperties

    title?: React.CSSProperties
    titleSmall?: React.CSSProperties
    titleMedium?: React.CSSProperties
    titleLarge?: React.CSSProperties
  }
  interface TypographyPropsVariantOverrides {
    label: true
    labelSmall: true
    labelMedium: true
    labelLarge: true

    body: true
    bodySmall: true
    bodyMedium: true
    bodyLarge: true

    display: true
    displaySmall: true
    displayMedium: true
    displayLarge: true

    headline: true
    headlineSmall: true
    headlineMedium: true
    headlineLarge: true

    title: true
    titleSmall: true
    titleMedium: true
    titleLarge: true

    h1: false
    h2: false
    h3: false
    h4: false
    h5: false
    h6: false
    subtitle1: false
    subtitle2: false
    body1: false
    body2: false
    button: false
    caption: false
    overline: false
  }
}

const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00e0b5',
      },
      secondary: {
        main: '#ff7dcc',
      },
      error: {
        main: '#ffb4a9',
      },
      success: {
        main: '#82cd7b',
      },
      background: {
        default: '#161818',
        paper: '#202222',
      },
      text: {
        primary: '#e0e3e0',
      },
      color: {
        primary: '#00e0b5',
        onPrimary: '#00382b',
        primaryContainer: '#005140',
        onPrimaryContainer: '#0dffd2',
        secondary: '#b2cdc2',
        onSecondary: '#1d352e',
        secondaryContainer: '#344c44',
        onSecondaryContainer: '#cee9de',
        tertiary: '#a9cbe2',
        onTertiary: '#0e3446',
        tertiaryContainer: '#294b5e',
        onTertiaryContainer: '#c4e7ff',
        error: '#ffb4a9',
        errorContainer: '#930006',
        onError: '#680003',
        onErrorContainer: '#ffdad4',
        background: '#161818',
        onBackground: '#e0e3e0',
        surface: '#191c1b',
        onSurface: '#e0e3e0',
        surfaceVariant: '#3f4945',
        onSurfaceVariant: '#bfc9c4',
        surface1: '#202222',
        surface2: '#252727',
        surface3: '#292b2b',
        surface4: '#2e3030',
        surface5: '#323434',
        outline: '#89938e',
        inverseOnSurface: '#191c1b',
        inverseSurface: '#e0e3e0',
        inversePrimary: '#006b55',
        white: '#ffffff',
        black: '#000000',
      },
    },
    shadows: shadowArray,
    typography: {
      fontFamily: [
        'proxima-nova', // Default
        'Metropolis',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variant: 'body',
          variantMapping: {
            display: 'h1',
            headline: 'h2',
            title: 'h3',
            label: 'label',
            body: 'p',
            displaySmall: 'h1',
            headlineSmall: 'h2',
            titleSmall: 'h3',
            labelSmall: 'label',
            bodySmall: 'p',
            displayMedium: 'h1',
            headlineMedium: 'h2',
            titleMedium: 'h3',
            labelMedium: 'label',
            bodyMedium: 'p',
            displayLarge: 'h1',
            headlineLarge: 'h2',
            titleLarge: 'h3',
            labelLarge: 'label',
            bodyLarge: 'p',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            textTransform: 'unset',
            '&:hover': { color: theme.palette.color.primary },
            ...(ownerState.variant === 'outlined' && {
              border: `1px solid ${theme.palette.color.outline}`,
            }),
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: () => ({ textTransform: 'unset' }),
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            borderTopLeftRadius: '0.125rem',
            borderTopRightRadius: '0.125rem',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0, // Smollest
        sm: 600, // Small
        md: 905, // Medium
        lg: 1240, // DesktopSmall
        xl: 1440, // DesktopBig
      },
    },
    spacing: [0, 8, 12, 16, 24] as number[],
  }),
  { breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'] }
)

darkTheme.typography.display = {
  // Display
  fontWeight: 400,
  [defaultTheme.breakpoints.up('xs')]: {
    fontSize: 36,
    lineHeight: '44px',
  },
  [defaultTheme.breakpoints.up('md')]: {
    fontSize: 45,
    lineHeight: '52px',
  },
  [defaultTheme.breakpoints.up('lg')]: {
    fontSize: 57,
    lineHeight: '64px',
  },
}
darkTheme.typography.displaySmall = {
  fontWeight: 400,
  fontSize: 36,
  lineHeight: '44px',
}
darkTheme.typography.displayMedium = {
  fontWeight: 400,
  fontSize: 45,
  lineHeight: '52px',
}
darkTheme.typography.displayLarge = {
  fontWeight: 400,
  fontSize: 57,
  lineHeight: '64px',
}
darkTheme.typography.headline = {
  // Headline
  fontWeight: 400,
  [defaultTheme.breakpoints.up('xs')]: {
    fontSize: 24,
    lineHeight: '32px',
  },
  [defaultTheme.breakpoints.up('md')]: {
    fontSize: 28,
    lineHeight: '36px',
  },
  [defaultTheme.breakpoints.up('lg')]: {
    fontSize: 32,
    lineHeight: '40px',
  },
}
darkTheme.typography.headlineSmall = {
  fontWeight: 400,
  fontSize: 24,
  lineHeight: '32px',
}
darkTheme.typography.headlineMedium = {
  fontWeight: 400,
  fontSize: 28,
  lineHeight: '36px',
}
darkTheme.typography.headlineLarge = {
  fontWeight: 400,
  fontSize: 32,
  lineHeight: '40px',
}
darkTheme.typography.title = {
  // Title
  fontWeight: 600,
  [defaultTheme.breakpoints.up('xs')]: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.1,
  },
  [defaultTheme.breakpoints.up('md')]: {
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: 0.1,
  },
  [defaultTheme.breakpoints.up('lg')]: {
    fontWeight: 400,
    fontSize: 22,
    lineHeight: '28px',
  },
}
darkTheme.typography.titleSmall = {
  fontWeight: 600,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: 0.1,
}
darkTheme.typography.titleMedium = {
  fontWeight: 600,
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: 0.1,
}
darkTheme.typography.titleLarge = {
  fontWeight: 400,
  fontSize: 22,
  lineHeight: '28px',
}
darkTheme.typography.body = {
  fontWeight: 400,
  [defaultTheme.breakpoints.up('xs')]: {
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: 0.4,
  },
  [defaultTheme.breakpoints.up('md')]: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.25,
  },
  [defaultTheme.breakpoints.up('lg')]: {
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: 0.5,
  },
}
darkTheme.typography.bodySmall = {
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: 0.4,
}
darkTheme.typography.bodyMedium = {
  fontWeight: 400,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: 0.25,
}
darkTheme.typography.bodyLarge = {
  fontWeight: 400,
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: 0.5,
}
darkTheme.typography.label = {
  fontWeight: 600,
  [defaultTheme.breakpoints.up('xs')]: {
    fontSize: 11,
    lineHeight: '16px',
    letterSpacing: 0.25,
  },
  [defaultTheme.breakpoints.up('md')]: {
    fontSize: 12,
    lineHeight: '16px',
    letterSpacing: 0.25,
  },
  [defaultTheme.breakpoints.up('lg')]: {
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: 0.1,
  },
}
darkTheme.typography.labelSmall = {
  fontWeight: 600,
  fontSize: 11,
  lineHeight: '16px',
  letterSpacing: 0.25,
}
darkTheme.typography.labelMedium = {
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: 0.25,
}
darkTheme.typography.labelLarge = {
  fontWeight: 600,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: 0.1,
}

export default darkTheme
