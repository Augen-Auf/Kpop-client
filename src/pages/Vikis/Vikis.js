import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {fetchVikis} from "../../http/VikiAPI";
import {useHistory} from "react-router-dom";

const Vikis = () => {
    const history = useHistory();
    const [vikis, setVikis] = useState([])


    useEffect(() => {
        fetchVikis().then(r => {
            if(r && r.length > 0 )
            {
                r = r.map(item => {
                    item.imageLink = item.image_id ? process.env.REACT_APP_API_URL + 'api/images/' + item.image_id : null
                    return item
                })
            }
            console.log(r)
            setVikis(r)
        })
    }, [])
    const {user} = useContext(Context);
    console.log('user: ', user);

    return (
        <div className="flex justify-center font-montserrat font-normal py-10">
            <div className="max-w-6xl grid grid-cols-4 gap-32">
            {
                vikis && vikis.map(item =>
                <div className="h-80 w-72 rounded-md flex flex-col justify-end py-5 shadow-md bg-yellow"
                     style={{backgroundImage: item.imageLink ? `url(${ item.imageLink })` : null, backgroundSize: 'cover'}}>
                    <span className="bg-pink p-3 -mx-2 rounded-md text-center" onClick={() => {history.push('/vikis/'+ item.id)}}>{item.name}</span>
                </div>)
            }
            </div>
        </div>
    );
};

export default Vikis;
