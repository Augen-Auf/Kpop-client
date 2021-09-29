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
            <div className="max-w-6xl grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-10 gap-6">
                {
                    vikis && vikis.map(item =>
                        <div className="h-80 w-72 rounded-md flex flex-col justify-end py-5 shadow-md bg-yellow cursor-pointer"
                             onClick={() => {history.push('/vikis/'+ item.id)}}
                             style={{backgroundImage: item.imageLink ? `url(${ item.imageLink })` : null, backgroundSize: 'cover'}}>
                            <span className="bg-pink p-3 -mx-2 rounded-md text-center">{item.name}</span>
                        </div>)
                }
            </div>
        </div>
    );
};

export default Vikis;
