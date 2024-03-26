import {Button} from "@mui/material";
import parseCsv from "../service/parse-csv";
const UploadCsvButton = ({ onData }) => {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }
        const result = await parseCsv(file);

        document.title = file.name;
        onData(result);
    };

    return (
        <div>
            <input
                accept=".csv"
                style={{ display: 'none' }}
                id="upload-csv"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="upload-csv">
                <Button variant="contained" component="span">
                    Upload CSV
                </Button>
            </label>
        </div>
    );
};

export default UploadCsvButton;