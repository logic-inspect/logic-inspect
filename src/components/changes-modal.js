import React from 'react';
import {
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography
} from '@mui/material';

import CodeToClipboard from "./code-to-clipboard";

const buildData = (packages) => {
    if (packages.length === 0) {
        return [];
    }

    const createHighlightElements = (array, compareTo) => {
        const maxLength = Math.max(array.length, compareTo.length);
        let elements = [];

        for (let index = 0; index < maxLength; index++) {
            const item = array[index];
            const compareItem = compareTo[index];

            if (item === undefined) {
                elements.push(<span key={index}
                                    style={{textDecoration: "line-through", marginLeft: "3px"}}>Removed</span>);
            } else if (item !== compareItem) {
                elements.push(<span key={index} style={{backgroundColor: "red", marginLeft: "3px"}}>{item}</span>);
            } else {
                elements.push(<span key={index} style={{marginLeft: "3px"}}>{item}</span>);
            }
        }

        return elements;
    };

    const first = packages[0];

    const result = [{
        time: first.time,
        changes: createHighlightElements(first.data, first.data),
        data: first.data,
        checksum: first.checksum
    }];

    for (let i = 1; i < packages.length; i++) {
        const prevPackage = packages[i - 1];
        const from = prevPackage.data;

        const currentPackage = packages[i];
        const to = currentPackage.data;

        const highlightedChanges = createHighlightElements(to, from, false);

        result.push({
            time: currentPackage.time,
            changes: highlightedChanges,
            data: currentPackage.data,
            checksum: currentPackage.checksum
        });
    }

    return result;
};

function CustomModal({open, handleClose, target}) {
    const data = buildData(target?.changes || []);

    let body = (
        <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Changes history
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Package ID: {target?.id}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                First appears: {target?.firstAppears}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{mb: 2}}>
                Last appears: {target?.lastAppears}
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 300}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Checksum</TableCell>
                            <TableCell align="left">Generate code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.time}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row.time}
                                </TableCell>
                                <TableCell align="left">{row.changes}</TableCell>
                                <TableCell align="left">{row.checksum}</TableCell>
                                <TableCell align="center">
                                    <CodeToClipboard id={target.id} data={row.data} checksum={row.checksum}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxHeight: '80%',
                overflow: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4
            }}>
                {body}
            </Box>
        </Modal>
    );
}

export default CustomModal;