import { Button, Card, Checkbox, Container, IconButton, InputAdornment, MenuItem, OutlinedInput, Paper, Popover, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Tooltip, Typography, alpha, styled } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import moment from 'moment'
import Iconify from '../components/iconify/Iconify'
import CreateCategory from '../components/popups/category/CreateCategory'
import { categorySearch, fetchAllCategoies } from '../app/features/category/categorySlice'
import Scrollbar from '../components/scrollbar/Scrollbar'
import DeleteCategoryConfirmationPopup from '../components/popups/category/DeleteCategoryConfirmationPopup';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

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

const CategoryPage = () => {
    const dispatch = useDispatch();

    const [page, setPage] = useState(0);

    const [limit, setLimit] = useState(10);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selected, setSelected] = useState([]);

    const [open, setOpen] = useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState(null);

    const [isEdit, setIsEdit] = useState(false);

    const [openCreateCategoryDialog, setOpenCreateCategoryDialog] = useState(false);

    const [serachValue, setSerachValue] = useState('');

    const { categories, count } = useSelector((state) => state.category);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(event.target.value)
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = categories.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, n) => {
        const selectedIndex = selected.indexOf(n);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, n);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleOpenMenu = (event, category) => {
        setOpen(event.currentTarget);
        setSelectedCategory(category);
    };

    const handleEditClick = () => {
        setIsEdit(true);
        setOpenCreateCategoryDialog(true)
    }

    const handleSearch = async (event) => {
        setSerachValue(event.target.value);
        try {
            const query = {
                searchData: event.target.value,
                page: page + 1,
                limit
            }
            await dispatch(categorySearch(query))
        } catch (error) {
            console.error('Error fetching blog data:', error);
        }
        setPage(0);
    }


    const allCategoryData = useCallback(async () => {
        try {
            const query = {
                page: page + 1,
                limit
            }
            await dispatch(fetchAllCategoies(query))
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [dispatch, limit, page]);

    useEffect(() => {
        allCategoryData();
    }, [allCategoryData]);

    return (
        <>
            <Helmet>
                <title> Dashboard: Category | Minimal UI </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Category
                    </Typography>
                    <Button variant="contained" onClick={() => setOpenCreateCategoryDialog(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Category
                    </Button>
                </Stack>
            </Container>
            <Card>
                {categories?.length ?
                    <Scrollbar>
                        <StyledRoot
                            sx={{
                                ...(selected.length > 0 && {
                                    color: 'primary.main',
                                    bgcolor: 'primary.lighter',
                                }),
                            }}
                        >
                            {selected.length > 0 ? (
                                <Typography component="div" variant="subtitle1">
                                    {selected.length} selected
                                </Typography>
                            ) : (
                                <StyledSearch
                                    disabled={count === 0}
                                    value={serachValue}
                                    onChange={handleSearch}
                                    placeholder="Search category..."
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                                        </InputAdornment>
                                    }
                                />
                            )}

                            {selected.length > 0 ? (
                                <Tooltip title="Delete">
                                    <IconButton>
                                        <Iconify icon="eva:trash-2-fill" />
                                    </IconButton>
                                </Tooltip>
                            ) : null}
                        </StyledRoot>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selected.length > 0 && selected.length < count}
                                                checked={count > 0 && selected.length === count}
                                                onChange={handleSelectAllClick}
                                                disabled={count === 0}
                                            />
                                        </TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Created Date</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {categories?.length && categories?.map((row) => {
                                        const { _id, name, createdAt } = row;
                                        const selectedCategory = selected.indexOf(name) !== -1;

                                        return (
                                            <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedCategory}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedCategory}
                                                        onChange={(event) => handleClick(event, name)}
                                                    />
                                                </TableCell>

                                                <TableCell align="left">{name}</TableCell>

                                                <TableCell align="left">{moment(createdAt).format('ll')}</TableCell>

                                                <TableCell align="right" onClick={(e) => handleOpenMenu(e, row)}>
                                                    <IconButton size="large" color="inherit" >
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>

                            </Table>
                        </TableContainer>
                    </Scrollbar> :
                    <Paper
                        sx={{
                            textAlign: 'center',
                            padding: '20px',
                        }}
                    >
                        <Typography variant="body2">
                            No results
                        </Typography>
                    </Paper>
                }
                {count !== 0 ?
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={count || 1}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    /> : null
                }
                <CreateCategory
                    category={isEdit ? selectedCategory : null}
                    open={openCreateCategoryDialog}
                    onClose={() => setOpenCreateCategoryDialog(false)}
                    page={page}
                    limit={limit}
                    setPage={setPage}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    setOpen={setOpen}
                />
                <DeleteCategoryConfirmationPopup
                    id={selectedCategory?._id}
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    message="Are you sure you want to continue?"
                    page={page}
                    limit={limit}
                    setPage={setPage}
                />
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

                    <MenuItem sx={{ color: 'error.main' }} onClick={() => setOpenDeleteDialog(true)}>
                        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                        Delete
                    </MenuItem>
                </Popover>
            </Card>
        </>
    )
}

export default CategoryPage
