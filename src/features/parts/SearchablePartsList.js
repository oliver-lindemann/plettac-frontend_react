import { FilterListOutlined, Search, SearchOffOutlined } from "@mui/icons-material";
import { Grid, InputAdornment, Paper, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useMemo, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { getGroupAsString } from "../../components/parts/list/DefaultPartItemsListHeader";
import PartsList from "../../components/parts/list/PartsList";
import { removeWhitespace } from "../../utils/StringUtils";
import PartDetails from "./PartDetails";
import PartItem from "./PartItem";

const SearchablePartsList = ({ parts }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [filterActive, setFilterActive] = useState(false);
    const [selectedOrigin, setSelectedOrigin] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);

    const searchValues = searchQuery.toLowerCase().split(' ');
    const filteredParts = parts.filter(part => !!filterActive ? part.origin === selectedOrigin : true).filter(part => searchValues.every(searchValue => removeWhitespace(JSON.stringify(part)).toLowerCase().includes(searchValue)));

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

    const displayPartAside = useMediaQuery('(min-width:1200px)');

    const showPartInformation = (part) => {
        setSelectedPart(part);
    }

    return (
        <Grid container sx={{ m: 0, p: 0 }}>
            <Grid item xs={12} sm={12} md={12} lg={8}>
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
                        <Tooltip title={`Filter ${filterActive ? 'ausschalten' : 'einschalten'}`}>
                            <ToggleButton
                                value="filterActive"
                                selected={filterActive}
                                onChange={onFilterSelected}
                                color="primary"
                            >
                                <FilterListOutlined />
                            </ToggleButton>
                        </Tooltip>
                    </div>


                    {
                        !!filterActive && (
                            <>
                                <MobileView>
                                    <Tabs
                                        variant="scrollable"
                                        value={selectedOrigin}
                                        onChange={(e, newValue) => !!newValue && setSelectedOrigin(newValue)}
                                    >
                                        {
                                            partGroups.map((origin, index) => <Tab key={index} value={origin} label={getGroupAsString(origin)} />)
                                        }
                                    </Tabs>
                                </MobileView>
                                <BrowserView>
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
                                </BrowserView>
                            </>
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
                                            <PartItem part={part} onClick={displayPartAside ? showPartInformation : null} />
                                        </div>
                                    )}
                                />
                            )
                    }
                </Paper >
            </Grid >
            <Grid item
                xs={12} sm={12} lg={4}
                sx={{
                    display: { xs: "none", sm: "none", md: "none", lg: "block", xl: "block", xxl: "block" },
                    px: 2
                }}
                style={{ height: 'calc(100vh - 151px)', overflowY: 'scroll' }}
            >
                <PartDetails part={selectedPart} />
            </Grid>
        </Grid >
    )
}

export default SearchablePartsList