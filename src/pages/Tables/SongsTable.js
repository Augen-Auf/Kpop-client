import React, {Fragment, useState} from 'react';
import ReactToExcel from "react-html-table-to-excel";

const SongsTable = ({plotData}) => {
    const [fileName, setFileName] = useState('Top_10_Songs')
    return (
        <Fragment>
            <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="min-w-1/2 border p-2 focus:outline-none rounded-md"/>
            <table id="topSongs" className="min-w-1/2 lg:block hidden">
                <thead className="border-2">
                <tr className="bg-yellow">
                    <th className="p-3 border-r-2">Songs</th>
                    <th className="p-3">Popularity</th>
                </tr>
                </thead>
                <tbody>
                {
                    plotData && plotData.map((songs, index) => {
                        const {name, popularity } = songs;
                        return (<tr key={index + 1} className="border-b-2 border-l-2 border-r-2">
                            <td className="p-3 border-r-2">{name}</td>
                            <td className="p-3">{popularity}</td>
                        </tr>)
                    })}
                </tbody>
            </table>

            <ReactToExcel
                className="p-3 bg-green-400 rounded-md text-white hover:bg-green-500 focus:outline-none"
                table="topSongs"
                filename={fileName.trim() !== '' ? fileName : "Top_10_Songs"}
                sheet="sheet1"
                buttonText="Экспортировать в Excel"
            />
        </Fragment>
    );
};

export default SongsTable;
