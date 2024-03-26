import './App.css';
import Toolbar from "./components/toolbar";
import {useState} from "react";
import StatisticView from "./components/statistic-view";
import TableView from "./components/table-view";

function App() {
    const [view, setView] = useState(undefined);

    const showStatistic = (data) => {
        setView(
            <StatisticView packages={data}/>
        )
    }

    const showTable = (data) => {
        setView(
            <TableView packages={data}/>
        )
    }

    return (
        <div className="App">
            <Toolbar onClickStatistic={showStatistic} onClickTableView={showTable}/>
            {view}
        </div>
    );
}

export default App;
