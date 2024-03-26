import React from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, Menu, MenuItem } from '@mui/material';
const FilterDropdown = ({ name, options, activeOptions, onResetToggle, onOptionToggle }) => {
    const [menuAnchor, setMenuAnchor] = React.useState(null);

    return (
        <>
            <Button
                aria-controls="filter-menu"
                aria-haspopup="true"
                onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
                {name}
            </Button>
            <Menu
                id="filter-menu"
                anchorEl={menuAnchor}
                keepMounted
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
            >
                <MenuItem>
                    <FormGroup>
                        <Button onClick={onResetToggle}>Reset</Button>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={activeOptions.includes(option)}
                                        onChange={() => onOptionToggle(option)}
                                    />
                                }
                                label={option}
                            />
                        ))}
                    </FormGroup>
                </MenuItem>
            </Menu>
        </>
    );
};

export default FilterDropdown;
