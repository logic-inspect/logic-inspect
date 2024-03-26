import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CodeToClipboard = ({ id, data, checksum }) => {
    const [copied, setCopied] = useState(false);

    const generateCode = () => {
        let code = data.map((byte, index) => `LinBus.LinMessage[${index}] = 0x${byte};`).join('\n');
        if (checksum !== undefined) {
            code += `\nLinBus.LinMessage[${data.length}] = 0x${checksum};`;
        }

        let length = data.length;

        if(checksum) {
            length = length + 1;
        }

        code += `\n\nLinBus.writeFrameClassicNoChecksum(0x${id}, ${length});\n`;
        code += `delayMicroseconds(2900);`;

        return code;
    };

    const copyToClipboard = () => {
        const codeToCopy = generateCode();
        navigator.clipboard.writeText(codeToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 800);
            })
            .catch(err => console.error('Error while copy text: ', err));
    };

    return (
        <Tooltip title="Copy to clipboard" placement="top">
            <IconButton onClick={copyToClipboard} aria-label="copy">
                {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default CodeToClipboard;