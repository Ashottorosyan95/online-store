import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, Container, Stack, Typography, TablePagination } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import CreateBlogDialog from '../components/popups/blog/CreateBlogDialog';
import { fetchAllBlogs, filterBlog, searchBlog } from '../app/features/blog/blogSlice';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function BlogPage() {
  const dispatch = useDispatch();

  const { blogs, count } = useSelector((state) => state.blog);

  const { categoriesData } = useSelector((state) => state.category);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [filterName, setFilterName] = useState('');

  const [filter, setFilter] = useState("");

  const [openCreateBlogDialog, setOpenCreateBlogDialog] = useState(false);

  const handleCreateBlogClick = async () => {
    setOpenCreateBlogDialog(true)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value)
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearch = async (event) => {
    setFilterName(event.target.value);
    try {
      const query = {
        searchData: event.target.value,
        page: page + 1,
        limit
      }
      await dispatch(searchBlog(query))
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
    setPage(0);
  };

  const onSort = async (e) => {
    setFilter(e.target.value);
    try {
      const query = {
        name: e.target.value,
        page: page + 1,
        limit
      }
      if (e.target.value) {
        await dispatch(filterBlog(query))
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  }

  const allBlogData = useCallback(async () => {
    try {
      const query = {
        page: page + 1,
        limit
      }
      await dispatch(fetchAllBlogs(query))
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dispatch, limit, page]);

  useEffect(() => {
    allBlogData();
  }, [allBlogData]);

  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" onClick={handleCreateBlogClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Post
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch count={count} filterName={filterName} onFilterName={handleSearch} />
          <BlogPostsSort options={categoriesData} onSort={onSort} filter={filter} allBlogData={allBlogData}  />
        </Stack>

        <Grid container spacing={3}>
          {blogs?.map((post, index) => (
            <BlogPostCard
              key={post._id}
              post={post}
              index={index}
            />
          ))}
        </Grid>
        <Grid>
          {count !== 0 ?
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={count || 1}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> : null
          }
        </Grid>

        <CreateBlogDialog
          open={openCreateBlogDialog}
          onClose={() => setOpenCreateBlogDialog(false)}
          page={page}
          limit={limit}
          setPage={setPage}
          categories={categoriesData}
        />
      </Container>
    </>
  );
}
