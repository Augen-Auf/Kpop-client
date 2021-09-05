import React,{useEffect, useState} from 'react';
import {getComments} from "../../http/userAPI";
import moment from "moment";

const UserComments = ({ userId }) => {

    const [userComments, setUserComments] = useState([])

    const localeDate = date => {
        moment.locale('ru')
        return moment(date).calendar();
    }

    const getUserComments = async (id) => {
        return await getComments(id)
    }
    useEffect(() => {
        getUserComments(userId).then(r => {
            console.log('userComments', r)
            setUserComments(r)
        })
    }, [])

    return (
        <div className="p-5 flex flex-col space-y-4">
            {userComments && userComments.length > 0 && userComments.map(item =>
            <div className="flex bg-white px-3 py-3 rounded-md">
                <div className="w-4/6">
                    <span className="text-sm text-pink">Комментарий к новости: {item.news.title}</span>
                    <p className="text-lg">{item.text}</p>
                </div>
                <div className="flex justify-end w-2/6">
                    <span className="text-sm">{localeDate(item.createdAt)}</span>
                </div>
            </div>
            )}
        </div>
    );
}

export default UserComments;
