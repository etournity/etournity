import React from 'react'

if (!process.browser) React.useLayoutEffect = React.useEffect
