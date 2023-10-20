import PropTypes from 'prop-types';
// @mui
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

BlogPostsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
  filter: PropTypes.string,
  allBlogData: PropTypes.func
};

export default function BlogPostsSort({ options, onSort, filter, allBlogData }) {
  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={filter}
          onChange={onSort}
          label="Filter"
        >
          <MenuItem value="" onClick={() => allBlogData()}>
            <em>None</em>
          </MenuItem>
          {options?.map(cat => {
            return (
              <MenuItem key={cat._id} value={cat.name}>By {cat.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </div>
  );
}
