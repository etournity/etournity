import React from 'react'
import type { NextPage } from 'next'
import {
  Box,
  Slider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@mui/material'

const Home: NextPage = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: 'background.default',
      overflow: 'hidden',
      borderRadius: '5px',
      boxShadow: 1,
      fontWeight: 'bold',
    }}
  >
    <Box>
      <h1>Admin Panel</h1>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>MUI Example</h2>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          borderRadius: '5px',
          fontWeight: 'bold',
        }}
      >
        <Box
          component="img"
          sx={{
            height: 233,
            width: 350,
            maxHeight: { xs: 233, md: 167 },
            maxWidth: { xs: 350, md: 250 },
          }}
          alt="The house from the offer."
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-start' },
            m: 3,
            minWidth: { md: 350 },
          }}
        >
          <Box component="span" sx={{ fontSize: 16, mt: 1 }}>
            123 Main St, Phoenix AZ
          </Box>
          <Box component="span" sx={{ color: 'primary.main', fontSize: 22 }}>
            $280,000 — $310,000
          </Box>
          <Box
            sx={{
              mt: 1.5,
              p: 0.5,
              bgcolor: 'background.paper',
              borderRadius: '5px',
              color: 'primary.main',
              fontWeight: 'medium',
              display: 'flex',
              fontSize: 12,
              alignItems: 'center',
              '& svg': {
                fontSize: 21,
                mr: 0.5,
              },
            }}
          >
            CONFIDENCE SCORE 85%
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: 200 }}>
        <Slider defaultValue={20} aria-label="slider" />
      </Box>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Box>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              gutterBottom
              color="text.secondary"
              sx={{ fontSize: 14 }}
            >
              Word of the Day
            </Typography>
            <Typography variant="label" component="div">
              Yeet
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adjective
            </Typography>
            <Typography variant="body">
              well meaning and kindly.
              <br />a benevolent smile
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'color.primary',
        overflow: 'hidden',
        borderRadius: '5px',
        boxShadow: 'boxshadow.elevation1',
        fontWeight: 'bold',
      }}
    >
      <h2>Next.js Example</h2>
      <Box
        sx={{
          bgcolor: 'color.onSecondaryContainer',
          boxShadow: 'shadows[25]',
        }}
      >
        <h3>Hello Next.js!</h3>
      </Box>
    </Box>
    <Typography variant="title">Hallo</Typography>
  </Box>
)

export default Home
