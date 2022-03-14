import React, { useContext, useEffect, useState } from 'react';
import { FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { ClientContext } from '../context/main';
import { useCheckOwnership } from '../hooks/useCheckOwnership';

type TPoolOption = 'balance' | 'locked';

export const TokenPoolSelector: React.FC<{ onSelect: (pool: TPoolOption) => void }> = ({ onSelect }) => {
  const [value, setValue] = useState<TPoolOption>('balance');
  const {
    userBalance: { tokenAllocation, balance, fetchBalance, fetchTokenAllocation },
    currency,
  } = useContext(ClientContext);

  const { ownership } = useCheckOwnership();

  useEffect(() => {
    (async () => {
      await fetchBalance();
      await fetchTokenAllocation();
    })();
  }, []);

  useEffect(() => {
    onSelect(value);
  }, [value]);

  const handleChange = (e: SelectChangeEvent) => setValue(e.target.value as TPoolOption);

  return (
    <FormControl fullWidth>
      <InputLabel>Token pool</InputLabel>
      <Select
        label="Token Pool"
        onChange={handleChange}
        value={value}
        disabled={ownership.hasOwnership}
        renderValue={(value) => <Typography sx={{ textTransform: 'capitalize' }}>{value}</Typography>}
      >
        <MenuItem value="balance">
          <ListItemText
            primary="Balance"
            secondary={`${balance?.printable_balance}`}
            secondaryTypographyProps={{ sx: { textTransform: 'uppercase' } }}
          />
        </MenuItem>
        <MenuItem value="locked">
          {tokenAllocation && (
            <ListItemText
              primary="Locked"
              secondary={`${+tokenAllocation.locked + +tokenAllocation.spendable} ${currency?.major}`}
            />
          )}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
