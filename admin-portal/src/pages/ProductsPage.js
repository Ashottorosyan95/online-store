import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Button, Container, Stack, TablePagination, Typography } from '@mui/material';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
// mock
import PRODUCTS from '../_mock/products';
import Iconify from '../components/iconify/Iconify';
import CreateProductDialog from '../components/popups/product/CreateProductDialog';
import { fetchAllProducts } from '../app/features/product/productApis';

export default function ProductsPage() {
  const dispatch = useDispatch();

  const { categoriesData } = useSelector((state) => state.category);

  const { products, count } = useSelector((state) => state.product);

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

  const handleCreateProductClick = async () => {
    setOpenCreateProductDialog(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value)
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const allProductsData = useCallback(async () => {
    try {
      const query = {
        page: page + 1,
        limit
      }
      await dispatch(fetchAllProducts(query))
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dispatch, limit, page]);

  useEffect(() => {
    allProductsData();
  }, [allProductsData]);

  console.log('aaaaaaaaaaaaaaaa', products);

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

        <ProductList products={products} />
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
