import React, {Fragment, useState} from 'react';
import ReactToExcel from "react-html-table-to-excel";

const AudioParamTable = ({trackReqParams, audioDataTable}) => {
    const [fileName, setFileName] = useState('Characteristic')
    return (
        <Fragment>
            <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="min-w-1/2 border p-2 focus:outline-none rounded-md"/>
            <table id="propMusic" className="min-w-1/2 xl:visible invisible">
                <thead className="">
                <tr className="">
                    <th  className="p-3"/>
                    {trackReqParams.map(item => <td className="p-3 border-2 bg-yellow">{item}</td>)}
                </tr>
                </thead>
                <tbody>
                {
                    audioDataTable.map(item =>
                        <tr>
                            <td className="p-3 border-2 bg-yellow">{item.artist}</td>
                            {trackReqParams.map(param => <td className="p-3 border-2">{String(item[param]).replace('.',',')}</td>)}
                        </tr>
                    )
                }
                </tbody>
            </table>
            <ReactToExcel
                className="p-3 bg-green-400 rounded-md text-white hover:bg-green-500 focus:outline-none"
                table="propMusic"
                filename={fileName.trim() !== '' ? fileName : 'Characteristic'}
                sheet="sheet1"
                buttonText="Экспортировать в Excel"
            />
        </Fragment>
    );
};

export default AudioParamTable;
