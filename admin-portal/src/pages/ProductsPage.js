import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useSelector } from 'react-redux';
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import Iconify from '../components/iconify/Iconify';
import CreateProductDialog from '../components/popups/product/CreateProductDialog';

export default function ProductsPage() {
  const { categoriesData } = useSelector((state) => state.category);

  const [openFilter, setOpenFilter] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);


  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleCreateProductClick = async () =>{
    setOpenCreateProductDialog(true);
  }

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Products
          </Typography>
          <Button variant="contained" onClick={handleCreateProductClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
        </Stack>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <ProductList products={PRODUCTS} />
        {/* <ProductCartWidget /> */}
        <CreateProductDialog
          open={openCreateProductDialog}
          onClose={() => setOpenCreateProductDialog(false)}
          page={page}
          limit={limit}
          setPage={setPage}
          categories={categoriesData}
        />
      </Container>
    </>
  );
}
