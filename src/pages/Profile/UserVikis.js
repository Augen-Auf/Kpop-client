import React, {useEffect, useState} from 'react';
import moment from "moment";
import {useHistory} from "react-router-dom";
import { getVikis } from "../../http/userAPI";
import {deleteVikis} from "../../http/VikiAPI";

const UserVikis = ({userId}) => {
    const [userVikis, setUserVikis] = useState([])
    const history = useHistory()

    const removeViki = async (id) => {
        deleteVikis(id).then(r => {
            history.push('/vikis')
        })
    }

    const getUserVikis = async (id) => {
        return await getVikis(id)
    }
    useEffect(() => {
        getUserVikis(userId).then(r => {
            console.log('userVikis', r)
            if(r && r.length > 0) {
                r = r.map(item => {
                    item.imageLink = item.image_id ? process.env.REACT_APP_API_URL + 'api/images/' + item.image_id : null
                    return item
                })
            }
            setUserVikis(r)
        })
    }, [])

    return (
        <div className="p-5 flex flex-col">
            <div className="flex justify-between items-center">
                <span className="text-xl">Мои вики</span>
                <button className="bg-blue p-2 rounded-md hover:bg-pink focus:outline-none" onClick={() => {history.push('/create/vikis')}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
            { userVikis && userVikis.length > 0 ? userVikis.map( item =>
                <div className="mt-3 2xl:w-5/6 2xl:mx-auto w-full bg-pink flex sm:flex-row sm:justify-between flex-col rounded-md lg:items-center">
                    <div className="flex lg:py-0 py-3 lg:w-3/4">
                        <img src={item.imageLink ? item.imageLink : "img/Rose.jpg"} className="object-cover lg:h-24 lg:w-24 w-40 h-40 rounded-md mx-2 my-2" alt=""/>
                        <div className="flex flex-grow lg:flex-row flex-col lg:items-center justify-center">
                            <p className="mx-8 font-medium w-3/4 lg:text-lg hover:text-yellow cursor-pointer"
                               onClick={() => { history.push('/vikis/'+item.id) }}>
                                { item.name }
                            </p>
                            <p className="mx-8 w-1/4 lg:text-md text-sm">Добавлено: { moment(item.createdAt).format('DD.MM.YYYY') }</p>
                        </div>
                    </div>
                    <div className="flex lg:flex-row sm:flex-col lg:w-1/4 lg:justify-end lg:py-0 py-4 mx-3 lg:space-x-4 lg:space-y-0 sm:space-y-4 sm:space-x-0 space-y-0 space-x-4 sm:justify-start justify-center my-auto">
                        <button className="bg-white p-3 rounded-md hover:bg-yellow focus:outline-none" onClick={() => {history.push('/update/vikis/' + item.id)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                        </button>
                        <button className="bg-white p-3 rounded-md hover:bg-yellow focus:outline-none" onClick={() => removeViki(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            ) : <span>0 Вики</span>
            }
        </div>
    );
}

export default UserVikis;
