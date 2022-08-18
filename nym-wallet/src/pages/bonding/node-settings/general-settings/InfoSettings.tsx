import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Divider, Typography, TextField, Grid } from '@mui/material';

export const InfoSettings = ({ onSaveChanges }: { onSaveChanges: () => void }) => {
  const [valueChanged, setValueChanged] = useState<boolean>(false);
  const [mixPortValue, setMixPortValue] = useState<string>('1789');

  useEffect(() => {
    console.log(Object.entries(portSettings));
  }, []);
  const portSettings = [
    { id: 'mixPort', title: 'Mix port', value: '1789' },
    { id: 'verlocPort', title: 'Verloc Port', value: '1790' },
    { id: 'httpPort', title: 'HTTP Port', value: '8000' },
  ];

  const hostSettings = [{ id: 'host', title: 'Host', value: '95.216.92.229' }];
  const versionSettings = [{ id: 'version', title: 'Version', value: '95.216.92.229' }];
  return (
    <Box sx={{ width: 0.78 }}>
      <Grid container direction="column">
        <Grid item container direction="row" alignItems="left" justifyContent="space-between" padding={3}>
          <Grid item direction="column">
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Port</Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: (t) => (t.palette.mode === 'light' ? t.palette.nym.text.muted : 'text.primary'),
              }}
            >
              Change profit margin of your node
            </Typography>
          </Grid>
          <Grid spacing={3} item container alignItems="center" maxWidth="348px">
            {portSettings.map((item) => (
              <Grid item width={1} spacing={3}>
                <TextField
                  type="input"
                  label={item.title}
                  value={item.value}
                  onChange={(e) => console.log(`Field ${item.id} has change`, e.target.value)}
                  autoFocus
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Divider flexItem />
        <Grid item container direction="row" alignItems="left" justifyContent="space-between" padding={3}>
          <Grid item direction="column">
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Host</Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: (t) => (t.palette.mode === 'light' ? t.palette.nym.text.muted : 'text.primary'),
              }}
            >
              Lock wallet after certain time
            </Typography>
          </Grid>
          <Grid spacing={3} item container alignItems="center" maxWidth="348px">
            {hostSettings.map((item) => (
              <Grid item width={1} spacing={3}>
                <TextField
                  type="input"
                  label={item.title}
                  value={item.value}
                  onChange={(e) => console.log(`Field ${item.id} has change`, e.target.value)}
                  autoFocus
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Divider flexItem />
        <Grid item container direction="row" alignItems="left" justifyContent="space-between" padding={3}>
          <Grid item direction="column">
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>Version</Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: (t) => (t.palette.mode === 'light' ? t.palette.nym.text.muted : 'text.primary'),
              }}
            >
              Lock wallet after certain time
            </Typography>
          </Grid>
          <Grid spacing={3} item container alignItems="center" maxWidth="348px">
            {versionSettings.map((item) => (
              <Grid item width={1} spacing={3}>
                <TextField
                  type="input"
                  label={item.title}
                  value={item.value}
                  onChange={(e) => console.log(`Field ${item.id} has change`, e.target.value)}
                  autoFocus
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Divider flexItem />
        <Grid container justifyContent="end">
          <Button
            size="large"
            variant="contained"
            disabled={!valueChanged}
            onClick={onSaveChanges}
            sx={{ m: 3, width: '320px' }}
          >
            Save all changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
