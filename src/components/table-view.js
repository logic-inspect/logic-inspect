import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function buildTableData(packages, index) {
    if(packages.length === 0) {
        return [];
    }

    const latestPacketsById = {};

    for (let i = 0; i <= index; i++) {
        const packet = packages[i];
        latestPacketsById[packet.header_pid] = { ...packet, highlight: false };
    }

    return Object.values(latestPacketsById);
}

const TableView = ({ packages }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setCurrentIndex(0);
        updateTableData(0);
    }, [packages]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowRight') {
                nextPacket();
            } else if (event.key === 'ArrowLeft') {
                previousPacket();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, packages]);

    const updateTableData = (newIndex) => {
        const currentData = buildTableData(packages, newIndex);
        const prevData = newIndex > 0 ? buildTableData(packages, newIndex - 1) : [];

        currentData.forEach(packet => packet.highlight = false);


        currentData.forEach(packet => {
            const prevPacket = prevData.find(p => p.header_pid === packet.header_pid);
            if (!prevPacket || JSON.stringify(prevPacket) !== JSON.stringify(packet)) {
                packet.highlight = true;
            }
        });

        setTableData(currentData);
    };

    const nextPacket = () => {
        const nextIndex = currentIndex + 1;

        if(nextIndex > packages.length - 1) {
            return;
        }

        setCurrentIndex(nextIndex);
        updateTableData(nextIndex);
    };

    const previousPacket = () => {
        const prevIndex = currentIndex - 1;

        if(prevIndex < 0) {
            return;
        }

        setCurrentIndex(prevIndex);
        updateTableData(prevIndex);
    };

    if(packages.length === 0) {
        return (
            <span>No packages found</span>
        )
    }

    return (
        <>
            <Button onClick={previousPacket}>Previous</Button>
            <span>
              <strong>Time:</strong> {packages[currentIndex].time} |
              <strong> ID:</strong> {packages[currentIndex] ? packages[currentIndex].header_pid : 'N/A'} |
              <strong> ({currentIndex + 1}/{packages.length})</strong>
            </span>
            <Button onClick={nextPacket}>Next</Button>
            <TableContainer component={Paper} style={{maxWidth: '40%', margin: '0 auto', marginTop: '20px'}}>
                <Table aria-label="simple table">
                <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Data</TableCell>
                            <TableCell align="right">Checksum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((packet) => (
                            <TableRow key={packet.header_pid} style={{ backgroundColor: packet.highlight ? '#ffcccc' : 'transparent' }}>
                                <TableCell component="th" scope="row">{packet.header_pid}</TableCell>
                                <TableCell align="right">{Array.isArray(packet.data) ? packet.data.join(", ") : packet.data}</TableCell>
                                <TableCell align="right">{packet.checksum}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default TableView;