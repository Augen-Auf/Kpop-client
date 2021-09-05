import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import moment from "moment";
import {useHistory, useParams, useLocation} from "react-router-dom";
import {deleteVikis, getOneViki} from "../../http/VikiAPI";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactTooltip from "react-tooltip";

const VikiPage = () => {

    const {id} = useParams()
    const {user} = useContext(Context);

    const history = useHistory();
    const location = useLocation();

    const [viki, setViki] = useState()
    console.log('user: ', user);

    const getViki = async (id) => {
        return await getOneViki(id)
    }

    const transformToHTML = (text) => {
        return {__html: text}
    }

    useEffect(() => {
        getViki(id).then(r => {
            if(r) {
                console.log(r)
                r.birthday = moment(r.birthday).format('DD.MM.YY')
                if (r.image_id) {
                    r.image_id = process.env.REACT_APP_API_URL + 'api/images/' + r.image_id
                }
                setViki(r)
            }
            else {
                history.push('/vikis')
            }
        })
    }, [])


    return (
        <div className="flex justify-center font-montserrat font-normal py-10">
            {viki &&
            <div className="flex flex-col w-1/2 h-3/5 space-y-5">
                <div className="flex bg-pink p-5 rounded-md w-full justify-between">
                    <div className="flex space-x-5">
                        <div className="h-52 w-48 flex items-center rounded-md bg-yellow">
                            <img src={viki.image_id ? viki.image_id : null} className="object-cover h-full w-full rounded-md" alt=""/>
                        </div>
                        <div className="h-full flex flex-col justify-between">
                            <div className="flex flex-col space-y-3">
                                <div>
                                    <p className="text-4xl"> { viki.name } </p>
                                    <p> { viki.short_description } </p>
                                </div>
                                <div>
                                    <div className="flex flex-col rounded-md bg-orange-300 py-1 px-4 w-min">
                                        <span className="text-sm whitespace-nowrap">Дата рождения</span>
                                        <span className="text-center text-lg font-bold">{ viki.birthday }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-3">
                        <CopyToClipboard text={ 'http://localhost:3000' + location.pathname }>

                            <button data-tip="Скопировано!" className="p-2 bg-white rounded-full focus:outline-none hover:bg-yellow">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                </svg>
                            </button>
                        </CopyToClipboard>
                        <ReactTooltip
                             place="left"
                             className='bg-pink text-white'
                             effect='solid'
                        />
                    </div>
                </div>
                <div className="bg-white p-7 w-full rounded-md">
                    <h3>Об исполнителе:</h3>
                    <div dangerouslySetInnerHTML={transformToHTML(viki.info)} className="text-xl landing-6 space-y-4"/>
                </div>
            </div>
            }
        </div>
    );
}

export default VikiPage;
