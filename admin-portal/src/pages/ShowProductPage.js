import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Box, Grid, MenuItem, Popover, Typography, IconButton, Stack } from '@mui/material';
import ReactImageGallery from 'react-image-gallery';
import { getProductById } from '../app/features/product/productApis';
import Iconify from '../components/iconify/Iconify';
import { fCurrency } from '../utils/formatNumber';
import Label from '../components/label/Label';
import CreateProductDialog from '../components/popups/product/CreateProductDialog';

export default function ShowProductPage() {
  const dispatch = useDispatch();

  const location = useLocation();

  const productId = location.state.productId;

  const [open, setOpen] = useState(null);

  const [editProductDialog, setEditProductDialog] = useState(false);

  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const { productData } = useSelector((state) => state.product);

  const { categoriesData } = useSelector((state) => state.category);

  const images = [];

  productData?.pictures.forEach(elm => {
    images.push({
      original: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`,
      thumbnail: `${process.env.REACT_APP_AMAZON_S3_URL}/${elm}`
    })
  });

  const handleEditClick = () => {
    setIsEdit(true);
    setEditProductDialog(true)
  }

  const product = useCallback(async () => {
    try {
      const query = {
        productId,
      }
      await dispatch(getProductById(query))
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }, [dispatch, productId]);

  useEffect(() => {
    product();
  }, [product]);

  console.log('productData', productData);

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '400px 1fr',
      gridGap: '30px'
    }}>
      <Grid sx={{ position: 'relative' }}>
        {productData?.status && (
          <Label
            variant="filled"
            color={(productData?.status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {productData?.status}
          </Label>
        )}
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
            {productData?.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            SKU:&nbsp;<Typography variant="h4" component="h2" color={'#2196f3'}>{productData?.SKU}</Typography>
          </Box>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ marginTop: '8px' }}>
            <Typography variant="subtitle1">
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                }}
              >
                {productData?.price && fCurrency(productData?.price)}դ.
              </Typography>
              &nbsp;
              {fCurrency(`${productData?.salaryPrice}`)}դ.
            </Typography>
          </Stack>

          {productData?.size ?
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              Size:&nbsp;<Typography>{productData?.size}</Typography>
            </Box> : null
          }

          <Box sx={{ marginTop: '8px' }}>
            <Typography variant='h5'>Description</Typography>
            <Box>{productData?.description}</Box>
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
          onClose={() => setOpen(null)}
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
          <MenuItem onClick={handleEditClick}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: 'error.main' }} onClick={() => setDeleteProductDialog(true)}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
        <CreateProductDialog
          open={editProductDialog}
          onClose={() => setEditProductDialog(false)}
          categories={categoriesData}
          product={productData}
          isEdit={isEdit}
        />
        {/* <DeleteConfirmationPopup
          id={productData?._id}
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          message="Are you sure you want to continue?"
        /> */}
      </Box>
    </Box>
  )
};
