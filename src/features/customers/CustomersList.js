import { Search } from "@mui/icons-material";
import { CircularProgress, InputAdornment, TablePagination, TextField, ThemeProvider, Typography, createTheme, useTheme } from "@mui/material";
import { deDE } from '@mui/material/locale';
import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteCustomer } from "../../app/api/customersApi";
import { removeWhitespace } from "../../utils/StringUtils";
import CustomerTable from "./browser/CustomerTable";
import CustomerTableCompact from "./mobile/CustomerTableCompact";

function CustomersList({ customers, mutate }) {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams({
        q: '',
        page: 0,
        rowsPerPage: 15
    });
    const { enqueueSnackbar } = useSnackbar();

    const theme = useTheme();
    const themeWithLocale = useMemo(() => createTheme(theme, deDE), [theme]);

    const [isLoading, setIsLoading] = useState(false);

    const searchQuery = searchParams?.get('q') || '';
    const page = +searchParams?.get('page');
    const rowsPerPage = +searchParams?.get('rowsPerPage');

    const searchValues = searchQuery.toLowerCase().split(' ');
    // Do not include _id-field in search result
    const filteredCustomers = customers?.filter(customer => searchValues.every(searchValue => removeWhitespace(JSON.stringify({ ...customer, _id: '' })).toLowerCase().includes(searchValue)));


    if (!customers) {
        return <div className="d-flex justify-content-center align-items-center gap-2">
            <CircularProgress color="error" />
            Lade Kunden...
        </div>
    }

    const handleChangePage = (event, newPage) => {
        setSearchParams(prev => {
            prev.set('page', newPage);
            return prev;
        }, { replace: true })
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setSearchParams(prev => {
            prev.set('rowsPerPage', newRowsPerPage);
            prev.set('page', 0);
            return prev;
        }, { replace: true })
    };

    const handleSearchQueryChanged = (e) => {
        setSearchParams(prev => {
            prev.set('q', e.target.value);
            return prev;
        }, { replace: true })
    }

    const handleViewCustomer = (customer) => navigate(`/customers/${customer._id}`);
    const handleDeleteCustomer = async (customer) => {
        const result = await Swal.fire({
            title: 'Kunden löschen?',
            text: 'Möchtest du den Kunden wirklich löschen?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Abbrechen',
            confirmButtonText: 'Ja'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                const result = await deleteCustomer(customer._id);
                await mutate();
                enqueueSnackbar("Kunde " + customer.name + " gelöscht.", { variant: 'success' });
            } catch (err) {
                Swal.fire({
                    title: "Fehler beim Löschen des Kundens",
                    text: err.message,
                    icon: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        }
    }

    const currentPage = page >= (filteredCustomers.length / rowsPerPage) ? 0 : page;

    return (
        <div style={{ marginBottom: '150px' }}>
            <div className="d-flex justify-content-center">
                <Typography fontSize={26}>Kunden</Typography>
            </div>
            <hr className="p-0 m-0 mb-1" />

            <div className="d-flex justify-content-between align-items-center" style={{ flexWrap: 'wrap' }}>

                <TextField
                    type="text"
                    size='small'
                    // sx={{ width: '45%' }}
                    value={searchQuery}
                    onChange={handleSearchQueryChanged}
                    placeholder="Kunden durchsuchen..."
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                    }}
                />
                <ThemeProvider theme={themeWithLocale}>
                    <TablePagination
                        component="div"
                        className='tablePagination'
                        count={filteredCustomers?.length}
                        page={currentPage}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[15, 25, 50, 100]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </ThemeProvider>
            </div>

            <MobileView>
                <CustomerTableCompact
                    customers={filteredCustomers?.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)}
                    isLoading={isLoading}
                    handleViewCustomer={handleViewCustomer}
                    handleDeleteCustomer={handleDeleteCustomer}
                />
            </MobileView>
            <BrowserView>
                <CustomerTable
                    customers={filteredCustomers?.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)}
                    isLoading={isLoading}
                    handleViewCustomer={handleViewCustomer}
                    handleDeleteCustomer={handleDeleteCustomer}
                />
            </BrowserView>

        </div>
    );
}

export default CustomersList;