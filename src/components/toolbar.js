import React, {useState} from 'react';
import {
    Button,
    Toolbar as MuiToolbar,
    Typography
} from '@mui/material';
import UploadCsvButton from './upload-csv-button';
import FilterDropdown from "./filter-dropdown";

function extractIdList(packages) {
    const uniqueIds = new Set(packages.map(packet => packet.header_pid));
    return [...uniqueIds].sort();
}

function filterById(packages, idList) {
    return packages.filter(target => {
        return idList.includes(target.header_pid);
    })
}

const Toolbar = ({onClickStatistic, onClickTableView}) => {
    const [packages, setPackages] = useState([]);
    const [idList, setIdList] = useState([]);
    const [activeIdList, setActiveIdList] = useState([]);

    const onData = (data) => {
        setPackages(data);

        const newIdList = extractIdList(data);
        setIdList(newIdList);
        setActiveIdList(newIdList);
    }

    const onIdToggle = (id) => {
        if (activeIdList.includes(id)) {
            setActiveIdList(activeIdList.filter(item => item !== id));
        } else {
            setActiveIdList([...activeIdList, id]);
        }
    }

    const targetPackages = filterById(packages, activeIdList);

    return (
        <MuiToolbar>
            <UploadCsvButton onData={onData}/>
            <Typography variant="body1" style={{marginLeft: '10px'}}>
                Target packages: {targetPackages.length}
            </Typography>
            <FilterDropdown name="Filter By Id" options={idList} activeOptions={activeIdList} onOptionToggle={onIdToggle} onResetToggle={() => {
                if(activeIdList.length === 0) {
                    setActiveIdList([...idList]);
                } else {
                    setActiveIdList([]);
                }
            }}/>

            <Button onClick={() => onClickStatistic(targetPackages)}>Statistic</Button>
            <Button onClick={() => onClickTableView(targetPackages)}>Table View</Button>
        </MuiToolbar>
    );
}
export default Toolbar;