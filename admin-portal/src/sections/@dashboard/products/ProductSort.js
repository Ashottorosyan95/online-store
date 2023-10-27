import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// @mui
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from '../../../components/iconify';
import { filterProduct } from '../../../app/features/product/productApis';

const SORT_BY_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceHighLow', label: 'Price: High-Low' },
  { value: 'priceLowHigh', label: 'Price: Low-High' },
];

ShopProductSort.propTypes = {
  page: PropTypes.number,
  limit: PropTypes.number,
};

export default function ShopProductSort({ page, limit }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);

  const [checkOptions, setCheckOptions] = useState(SORT_BY_OPTIONS[0].label)

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleSort = async (e) => {
    setCheckOptions(e.label);
    try {
      const query = {
        filterData: e.value,
        page: page + 1,
        limit
      }
      if (e.value) {
        await dispatch(filterProduct(query))
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
    setOpen(null);
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {checkOptions}
        </Typography>
      </Button>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value}
            onClick={() => handleSort(option)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
