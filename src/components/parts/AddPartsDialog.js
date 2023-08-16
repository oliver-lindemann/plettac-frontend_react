import { Add, ChevronRightOutlined, FilterListOutlined, Search, SearchOffOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, Divider, Grid, InputAdornment, Paper, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import PartDetails from "../../features/parts/PartDetails";
import PartItem from "../../features/parts/PartItem";
import { removeWhitespace, toCapitalCase } from "../../utils/StringUtils";
import PartsAmountList from "./PartsAmountList";
import PartsList from "./list/PartsList";
import { getGroupAsString } from "./list/DefaultPartItemsListHeader";

export const AddPartsDialog = ({ isOpen, closeDialog, parts, partsList, customPartsList, handleAddNewPart, handleAddCustomPart, handleAmountChangedParts, handleItemDeletedParts }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [filterActive, setFilterActive] = useState(false);
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);

    const searchValues = searchQuery.toLowerCase().split(' ');
    const filteredParts = parts?.filter(part => !!filterActive ? part.origin === selectedOrigin : true)
        .filter(part => searchValues.every(searchValue => removeWhitespace(JSON.stringify(part)).toLowerCase().includes(searchValue)))
        || [];

    const partGroups = useMemo(() => parts?.reduce((origins, part) => {
        if (!origins.includes(part.origin)) {
            origins.push(part.origin);
        }
        return origins;
    }, []) || [], [parts]);

    const onFilterSelected = () => {
        setFilterActive(filterActive => !filterActive);
        setSelectedOrigin(selectedOrigin => selectedOrigin || partGroups[0]);
    }

    const showPartInformation = (part) => {
        setSelectedPart(part);
    }

    const addCurrentPart = () => {
        handleAddNewPart(selectedPart);
    }

    const addCustomPart = () => {
        handleAddCustomPart({ inputValue: searchQuery })
    }

    const AddedPartsList = useMemo(() => (
        <PartsAmountList
            checklistParts={[...partsList, ...customPartsList]}
            onAmountChanged={handleAmountChangedParts}
            onItemDeleted={handleItemDeletedParts}
            height="calc(100vh - 190px)"
        />
    ), [partsList, customPartsList, handleAmountChangedParts, handleItemDeletedParts]);

    return (
        <Dialog
            fullScreen
            open={isOpen}
            onClose={closeDialog}
        >
            <DialogContent>
                <Grid container sx={{ m: 0, p: 0 }} spacing={1}>
                    <Grid item container md={7} lg={7}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <div>
                                <div className="d-flex gap-1">
                                    <TextField
                                        type="text"
                                        fullWidth
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Wonach suchst du?"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                                        }}
                                    />
                                    <ToggleButton
                                        value="filterActive"
                                        selected={filterActive}
                                        onChange={onFilterSelected}
                                        color="primary"
                                    >
                                        <FilterListOutlined />
                                    </ToggleButton>
                                </div>

                                {
                                    !!filterActive && (
                                        <ToggleButtonGroup
                                            exclusive
                                            color="primary"
                                            size="small"
                                            sx={{ flexWrap: 'wrap', marginTop: 1 }}
                                            value={selectedOrigin}
                                            onChange={(e, newValue) => !!newValue && setSelectedOrigin(newValue)}
                                        >
                                            {
                                                partGroups.map((origin, index) => <ToggleButton key={index} value={origin}>{getGroupAsString(origin)}</ToggleButton>)
                                            }
                                        </ToggleButtonGroup>
                                    )
                                }
                            </div>
                            <Paper
                                className="tableFixHead mt-2"
                                style={{ height: filterActive ? 'calc(100vh - 270px)' : 'calc(100vh - 220px)' }}
                            >
                                {
                                    filteredParts.length <= 0
                                        ? (
                                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", height: '100%' }}>
                                                <div>
                                                    <SearchOffOutlined fontSize='large' />
                                                    <Typography>Kein Bauteil gefunden. Hast du den Namen richtig geschrieben?
                                                    </Typography>
                                                </div>
                                            </div>
                                        )
                                        : (
                                            <PartsList
                                                parts={filteredParts}
                                                head={
                                                    (group) => (
                                                        <div style={{ backgroundColor: '#212529' }}
                                                            className='text-md-center p-2 shadow table-dark border border-dark'>
                                                            <p className="font-monospace p-0 m-0 fw-bold">{getGroupAsString(group)}</p>
                                                        </div>
                                                    )}
                                                row={(part) => (
                                                    <div className='border border-top-0' style={{ width: '100%', cursor: 'pointer' }}>
                                                        <PartItem part={part} onClick={showPartInformation} />
                                                    </div>
                                                )}
                                            />
                                        )
                                }
                            </Paper >
                        </Grid >

                        <Grid item
                            xs={12} sm={12} md={6} lg={6}
                            sx={{
                                display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block", xxl: "block" },
                                px: 2
                            }}
                            style={{ height: 'calc(100vh - 150px)', overflowY: 'scroll' }}
                        >
                            <Button
                                variant="outlined"
                                color="success"
                                fullWidth
                                disabled={!selectedPart}
                                className="mb-2"
                                startIcon={<Add />}
                                onClick={addCurrentPart}
                            >
                                Ausgewähltes Bauteil hinzufügen
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                disabled={!searchQuery}
                                className="mb-2"
                                startIcon={<Add />}
                                onClick={addCustomPart}
                            >
                                Suchbegriff als Bauteil erstellen
                            </Button>
                            <PartDetails part={selectedPart} />
                        </Grid>
                        {/* <Grid item className="d-flex justify-content-center align-items-center"> */}
                        {/* <Divider orientation="vertical" /> */}
                        {/* <ChevronRightOutlined />
                        </Grid> */}
                    </Grid>
                    <Grid item md={5} lg={5}>
                        <Typography variant="h5">Bereits hinzugefügte Elemente</Typography>
                        <Divider />
                        {AddedPartsList}
                    </Grid >
                </Grid >

            </DialogContent >
            <DialogActions>
                <Button type="submit" className="p-2" onClick={closeDialog}>Schließen</Button>
            </DialogActions>
        </Dialog >
    )
}

export default AddPartsDialog;