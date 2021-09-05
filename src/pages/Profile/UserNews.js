import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom'
import {getNews} from "../../http/userAPI";
import {deleteNews} from "../../http/NewsAPI";
import moment from "moment";
import 'moment/locale/ru'

const UserNews = ({ userId}) => {
    const [userNews, setUserNews] = useState([])
    const history = useHistory()

    const getUserNews = async (id) => {
        return await getNews(id)
    }

    const deleteUserNews = async (id) => {
        const data = await deleteNews(id)
        setUserNews(userNews.filter(item => item.id !== id))
    }

    useEffect(() => {
        getUserNews(userId).then(r => {
            console.log('userNews', r)
            if(r && r.length > 0)
            {
                r = r.map(item => {
                    item.imageLink = item.image_id ? process.env.REACT_APP_API_URL + 'api/images/' + item.image_id : null
                    return item
                })
            }
            setUserNews(r)
        });
    }, [])

    return (
        <div className="p-5 flex flex-col">
            <div className="flex justify-between items-center">
                <span className="text-xl">Мои новости</span>
                <button className="bg-blue p-2 rounded-md" onClick={() => history.push('/create/news')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>
            { userNews && userNews.length > 0 ? userNews.map( item =>
                <div className="mt-3 2xl:w-5/6 2xl:mx-auto w-full bg-pink flex sm:flex-row sm:justify-between flex-col rounded-md lg:items-center">
                    <div className="flex lg:py-2 lg:px-2 py-3 lg:w-3/4">
                        <div className="lg:h-24 lg:w-24 w-40 h-40 rounded-md bg-pink">
                            {item.imageLink &&
                            <img src={item.imageLink} className="object-cover rounded-md w-full h-full" alt=""/>
                            }
                        </div>
                        <div className="flex flex-grow lg:flex-row flex-col lg:items-center justify-center">
                            <p className="mx-8 font-medium w-3/4 lg:text-lg" onClick={() => { history.push('/news/'+item.id) }}>{ item.lid }</p>
                            <p className="mx-8 w-1/4 lg:text-md text-sm">Добавлено: { moment(item.createdAt).format('DD.MM.YYYY') }</p>
                        </div>
                    </div>
                    <div className="flex lg:flex-row sm:flex-col lg:w-1/4 lg:justify-end lg:py-0 py-4 mx-3 lg:space-x-4 lg:space-y-0 sm:space-y-4 sm:space-x-0 space-y-0 space-x-4 sm:justify-start justify-center my-auto">
                        <button className="p-2 bg-blue sm:w-max w-1/3 rounded-md items-center justify-center flex" onClick={() => {history.push('/update/news/'+item.id)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button className="p-2 bg-blue sm:w-max w-1/3 rounded-md items-center justify-center flex" onClick={() => deleteUserNews(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            ) : <span>0 Новостей</span>
            }
        </div>
    );
}

export default UserNews;
