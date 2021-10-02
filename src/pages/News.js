import React, {useEffect, useState} from 'react';
import {fetchNews, getAllTags} from "../http/NewsAPI";
import {useHistory} from "react-router-dom";
import moment from "moment";

const News = () => {
    const history = useHistory();
    const [news, setNews] = useState([])
    const [tags, setTags] = useState([])
    const [activeTag, setActiveTag] = useState(null)


    const sortNewsByDate = (a, b) => {
        const aDate = moment(a.createdAt)
        const bDate = moment(b.createdAt)
        if(aDate.diff(bDate) > 0)
            return -1
        if(aDate.diff(bDate) < 0)
            return 1
        return 0
    }

    const getAllNews = async () => {
        return await fetchNews()
    }

    const filterByTag = async (id) => {
        if(activeTag !== id) {
            setActiveTag(id)
            let filteringNews = await getAllNews()
            if(filteringNews && filteringNews.length > 0)
            {
                filteringNews = filteringNews.map(item => {
                    item.imageLink = item.image_id ? process.env.REACT_APP_API_URL + 'api/images/' + item.image_id : null
                    return item
                })
            }
            setNews(filteringNews.filter(item => item.tags.find(tag => tag.id === id)).sort(sortNewsByDate))
        }
        else {
            setActiveTag(null)
            let filteringNews = await getAllNews()
            if(filteringNews && filteringNews.length > 0)
            {
                filteringNews = filteringNews.map(item => {
                    item.imageLink = item.image_id ? process.env.REACT_APP_API_URL + 'api/images/' + item.image_id : null
                    return item
                })
            }
            setNews(filteringNews.sort(sortNewsByDate))
        }
    }

    useEffect(() => {
        getAllNews().then(r => {
            console.log(r)
            if(r && r.length > 0)
            {
                r = r.map(item => {
                    item.imageLink = item.image_id ? process.env.REACT_APP_API_URL + 'api/images/' + item.image_id : null
                    return item
                })
            }
            setNews(r.sort(sortNewsByDate))
        })
        getAllTags().then(r => {
            setTags(r)
        })
    },[])

    return (
        <div className="w-full font-montserrat md:pb-8 pb-4">
            <div className="max-w-7xl mx-auto flex md:flex-row flex-col-reverse justify-between py-10">
                <div className="flex flex-col space-y-10 mb:w-3/4 w-full px-4 pb-10">
                    <div className="w-full grid grid-rows-3 md:grid-cols-2 grid-cols-1 gap-4">
                        {news && news.length > 0 && news.slice(0,2).map( item =>
                            <div
                                className="py-5 rounded-md bg-pink bg-center row-span-3 flex items-end h-64 cursor-pointer"
                                onClick={() => {history.push('/news/'+item.id)}}
                                style={{backgroundImage: item.imageLink ? `url(${ item.imageLink })` : null, backgroundSize: 'cover'}}>
                                <div className="w-5/6 p-2 bg-yellow bg-opacity-80">
                                <span>
                                    {item.title}
                                </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4">
                        { news && news.slice(2).map( item =>
                            <div
                                className="py-5 rounded-md bg-pink h-48 bg-center flex items-end cursor-pointer"
                                onClick={() => {history.push('/news/'+item.id)}}
                                style={{backgroundImage: item.imageLink ? `url(${ item.imageLink })` : null, backgroundSize: 'cover'}}>
                                <div className="w-full p-2 bg-yellow bg-opacity-80">
                                <span className="text-xs">
                                    {item.title}
                                </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="md:sticky md:top-10 md:h-full flex flex-col space-y-4 md:w-1/4 w-full px-4 md:mb-0 mb-4">
                    <div className="w-full p-2 bg-yellow flex items-center justify-center rounded-md">
                        <span>Теги</span>
                    </div>
                    <div className="w-full flex flex-wrap justify-start">
                        {tags && tags.map(item =>
                            <div
                                className={`px-3 py-2 ${ activeTag === item.id ? 'bg-white' : 'hover:bg-white'} border border-gray-800 rounded-md m-2 cursor-pointer`}
                                onClick={() => filterByTag(item.id)}
                            >
                                <span>
                                    { item.tag }
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
