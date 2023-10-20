import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import ReactImageGallery from 'react-image-gallery';
import { Box, Grid, MenuItem, Popover, Typography, IconButton } from '@mui/material';
import { getBlogById } from '../app/features/blog/blogSlice';
import Iconify from '../components/iconify/Iconify';
import DeleteConfirmationPopup from '../components/popups/blog/DeleteConfirmationPopup';
import EditBlogDialog from '../components/popups/blog/EditBlogDialog';

const ShowBlogPostsPage = () => {
  const dispatch = useDispatch();
  const data = useLocation();
  const blogId = data.state.blogId;
  const images = [];
  const [open, setOpen] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { blogData } = useSelector((state) => state.blog);

  blogData?.pictures.forEach(elm => {
    images.push({
      original: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`,
      thumbnail: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`
    })
  });

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const blog = useCallback(async () => {
    try {
      const query = {
        blogId,
      }
      await dispatch(getBlogById(query))
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    blog();
  }, [blog]);

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '400px 1fr',
      gridGap: '30px'
    }}>
      <Grid>
        <ReactImageGallery
          items={images}
          showPlayButton={false}
          showBullets='true'
          showFullscreenButton={false}
          showNav={false}
        />
      </Grid>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Grid>
          <Typography variant="h3" component="h2">
            {blogData?.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'grey.500',
              marginTop: '8px'
            }}
          >
            <Iconify icon='eva:eye-fill' sx={{ width: 20, height: 20, mr: 0.5 }} />
            <Typography variant="caption">{blogData?.views}</Typography>
          </Box>
          <Box sx={{ marginTop: '8px' }}>
            <Typography variant='h5'>Description</Typography>
            <Box>{blogData?.description}</Box>
          </Box>
        </Grid>
        <Box align="right">
          <IconButton size="large" color="inherit" onClick={(e) => setOpen(e.currentTarget)}>
            <Iconify icon={'eva:more-vertical-fill'} />
          </IconButton>
        </Box>
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              '& .MuiMenuItem-root': {
                px: 1,
                typography: 'body2',
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem onClick={() => setOpenEditDialog(true)}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDeleteDialog(true)}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
        <DeleteConfirmationPopup
          id={blogData?._id}
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          message="Are you sure you want to continue?"
        />
        <EditBlogDialog
          blog={blogData}
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
        />
      </Box>
    </Box>
  )
}

export default ShowBlogPostsPage;
