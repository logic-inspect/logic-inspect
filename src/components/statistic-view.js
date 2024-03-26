import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    FormControlLabel, Checkbox
} from '@mui/material';
import ChangesModal from "./changes-modal";

const ID = "header_pid";
const DATA = "data"
const CHECKSUM = "checksum";

function unicIdList(array) {
    const result = new Set();
    for (let target of array) {
        result.add(target[ID]);
    }
    return [...result.values()];
}

function findById(array, id) {
    let result = [];
    for (let target of array) {
        if (target[ID] === id) {
            result.push(target);
        }
    }
    return result;
}

function findUnicData(array) {
    const result = new Set();
    for (let target of array) {
        const data = target[DATA];

        if (!data) {
            continue;
        }

        result.add(JSON.stringify(data));
    }

    return [...result.values()].map(target => {
        return JSON.parse(target);
    });
}

function findChanges(packages) {
    let currentData = JSON.stringify(packages[0][DATA]);
    let result = [packages[0]];

    for (const target of packages) {
        const dataAsString = JSON.stringify(target[DATA])

        if(currentData === dataAsString) {
            continue;
        }

        currentData = dataAsString;
        result.push(target);
    }

    return result;
}

function buildStatistic(packages) {
    const statistic = [];

    for (const id of unicIdList(packages)) {
        const result = findById(packages, id);

        const firstAppears = result[0].time;
        const lastAppears = result[result.length - 1].time;

        const unicData = findUnicData(result);
        const changes = findChanges(result);

        statistic.push({
            id: id,
            packagesNumber: result.length,
            unicPackagesNumber: unicData.length,
            example: JSON.stringify({
                id: id,
                data: result[0].data,
                checksum: result[0].checksum,
            }),
            firstAppears: firstAppears,
            lastAppears: lastAppears,
            changes: changes
        })
    }

    statistic.sort((a, b) => a.id.localeCompare(b.id));

    return statistic;
}

function containsChecksum(array) {
    let result = [];
    for (let target of array) {
        if (target[CHECKSUM] !== undefined) {
            result.push(target);
        }
    }
    return result;
}

function containsData(array) {
    let result = [];
    for (let target of array) {
        if (target[DATA].length > 0) {
            result.push(target);
        }
    }
    return result;
}

const StatisticView = ({ packages }) => {
    const [targetPackages, setTargetPackages] = useState(packages);
    const [showPackagesWithoutData, setShowPackagesWithoutData] = useState(true);
    const [showPackagesWithoutChecksum, setShowPackagesWithoutChecksum] = useState(true);
    const [showPackagesWithoutChanges, setShowPackagesWithoutChanges] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(undefined);

    useEffect(() => {
        setTargetPackages(packages);
    }, [packages]);

    let filteredPackages = targetPackages;

    if(!showPackagesWithoutChecksum) {
        filteredPackages = containsChecksum(filteredPackages);
    }

    if(!showPackagesWithoutData) {
        filteredPackages = containsData(filteredPackages);
    }

    let statistics = buildStatistic(filteredPackages);

    if(!showPackagesWithoutChanges) {
        statistics = statistics.filter(target => {
            return target.changes.length > 1;
        })
    }

    const firstPackageTime = filteredPackages[0].time
    const lastPackageTime = filteredPackages[filteredPackages.length - 1].time

    return (
        <>
            <Typography gutterBottom component="div"
                        style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <span>First package time:</span>
                <span>{Number.parseInt(firstPackageTime)}</span>
                <span>Last package time:</span>
                <span>{Number.parseInt(lastPackageTime)}</span>
            </Typography>
            <Typography variant="h6" gutterBottom component="div"
                        style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <FormControlLabel
                    control={<Checkbox checked={showPackagesWithoutChanges} onChange={() => {
                        setShowPackagesWithoutChanges(!showPackagesWithoutChanges);
                    }}/>}
                    label="Without changes"
                />
                <FormControlLabel
                    control={<Checkbox checked={showPackagesWithoutData} onChange={() => {
                        setShowPackagesWithoutData(!showPackagesWithoutData);
                    }}/>}
                    label="Without data"
                />
                <FormControlLabel
                    control={<Checkbox checked={showPackagesWithoutChecksum} onChange={() => {
                        setShowPackagesWithoutChecksum(!showPackagesWithoutChecksum);
                    }}/>}
                    label="Without checksum"
                />
            </Typography>

            <TableContainer component={Paper}>
                <Table aria-label="simple table" style={{maxWidth: '80%', margin: '0 auto'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="left">Total Packages</TableCell>
                            <TableCell align="left">Changes</TableCell>
                            <TableCell align="left">Unique Packages</TableCell>
                            <TableCell>
                                Example Package
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {statistics.map((stat) => (
                            <TableRow key={stat.id}>
                                <TableCell component="th" scope="row">
                                    {stat.id}
                                </TableCell>
                                <TableCell align="left">{stat.packagesNumber}</TableCell>
                                <TableCell align="left">
                                    <span className="link-like-span" onClick={() => {
                                        setModalData(stat)
                                        setShowModal(true);
                                    }}>
                                        {stat.changes.length}
                                    </span>
                                </TableCell>
                                <TableCell align="left">{stat.unicPackagesNumber}</TableCell>
                                <TableCell>
                                    {stat.example}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ChangesModal open={showModal} target={modalData} handleClose={() => {setShowModal(false)}}/>
        </>
    );
};

export default StatisticView;
