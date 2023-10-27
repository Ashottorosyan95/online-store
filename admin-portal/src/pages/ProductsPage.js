import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Button, Container, Stack, TablePagination, Typography } from '@mui/material';
// components
import { ProductFilterSidebar, ProductList, ProductSort } from '../sections/@dashboard/products';
import Iconify from '../components/iconify/Iconify';
import CreateProductDialog from '../components/popups/product/CreateProductDialog';
import { fetchAllProducts, searchProduct } from '../app/features/product/productApis';
import ProductSearch from '../sections/@dashboard/products/ProductSearch';
import CircularIndeterminate from '../components/loading/Loading';

export default function ProductsPage() {
  const dispatch = useDispatch();

  const { categoriesData } = useSelector((state) => state.category);

  const { products, count, isLoading } = useSelector((state) => state.product);

  const [searchName, setSearchName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);

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

  const handleSearch = async (event) => {
    setSearchName(event.target.value);
    try {
      const query = {
        searchData: event.target.value,
        page: page + 1,
        limit
      }
      await dispatch(searchProduct(query))
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
    setPage(0);
  }

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

  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      {isLoading ?
        <CircularIndeterminate /> :
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Products
            </Typography>
            <Button variant="contained" onClick={handleCreateProductClick} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Product
            </Button>
          </Stack>

          <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
            {/* <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={
                handleCloseFilter}
            /> */}
            <ProductSearch count={count} searchName={searchName} onSearchName={handleSearch} />
            <ProductSort page={page} limit={limit} />
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
      }
    </>
  );
}
