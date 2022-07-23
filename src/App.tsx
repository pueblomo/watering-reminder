import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import OverviewPage from "./pages/overview-page";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/:user" element={<OverviewPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
