import PropTypes from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import { InputAdornment, OutlinedInput, alpha } from '@mui/material';
// components
import Iconify from '../../../components/iconify';

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

export default function BlogPostsSearch({ count, filterName, onFilterName, }) {
  return (
    <StyledSearch
      disabled={count === 0}
      value={filterName}
      onChange={onFilterName}
      placeholder="Search user..."
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
    />
  );
}
