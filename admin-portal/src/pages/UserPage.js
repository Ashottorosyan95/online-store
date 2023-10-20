import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import moment from 'moment';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import account from '../_mock/account';
import { deleteCheckUsers, fetchAllUsers, searchUser } from '../app/features/user/allUsersSlice';
import EditUserDialog from '../components/popups/user/EditUserDialog';
import ConfirmationPopup from '../components/popups/user/ConfirmationPopup';
import CreateUserDialog from '../components/popups/user/CreateUserDialog';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'modifiedAt', label: 'Modified Date', alignRight: false },
  { id: '' },
];

export default function UserPage() {
  const dispatch = useDispatch();

  const { users, count } = useSelector((state) => state.allUsers);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const [limit, setLimit] = useState(5);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDialog, setOpenDialog] = useState(false);

  const [openCreateUserDialog, setOpenCreateUserDialog] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


  const handleOpenMenu = (event, user) => {
    setOpen(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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
      await dispatch(searchUser(query))
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - count) : 0;

  const isNotFound = !users?.length;

  const handelEditClick = () => {
    setOpenDialog(true);
    setOpen(null)
  }

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    setOpen(null)
  }

  const handleCreateUserClick = () => {
    setOpenCreateUserDialog(true);
  }

  const handleDeleteCheckUser = async () => {
    try {
      const query = {
        usersData: selected,
        page: page + 1,
        limit
      }
      await dispatch(deleteCheckUsers(query))
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const allUserData = useCallback(async () => {
    try {
      const query = {
        page: page + 1,
        limit
      }
      await dispatch(fetchAllUsers(query))
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [dispatch, limit, page]);

  useEffect(() => {
    allUserData();
  }, [allUserData]);

  console.log('selected', selected);

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button variant="contained" onClick={handleCreateUserClick} startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleSearch}
            count={count}
            handleDeleteCheckUser={handleDeleteCheckUser}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={count}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {users?.length && users?.map((row) => {
                    const { _id, username, email, role, avatar, createdAt, phone } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, _id)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={avatar} src={avatar || account.photoURL} />
                            <Typography variant="subtitle2" noWrap>
                              {username}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{role}</TableCell>

                        <TableCell align="left">{phone}</TableCell>

                        <TableCell align="left">{moment(createdAt).format('ll')}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not users
                          </Typography>

                          <Typography variant="body2">
                            No results found
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          {count !== 0 ?
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={count || 1}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> : null
          }
          <EditUserDialog
            user={selectedUser}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />
          <ConfirmationPopup
            user={selectedUser}
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            message="Are you sure you want to continue?"
            page={page}
            limit={limit}
            setPage={setPage}
          />
          <CreateUserDialog
            open={openCreateUserDialog}
            onClose={() => setOpenCreateUserDialog(false)}
            page={page}
            limit={limit}
            setPage={setPage}
          />
        </Card>
      </Container>

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
        <MenuItem onClick={handelEditClick}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleDeleteClick}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
