import React, {useState, useEffect} from 'react';
import {fetchNews, getAllTags} from "../http/NewsAPI";
import {useHistory} from "react-router-dom";
import moment from "moment";
import ReactPaginate from "react-paginate";

const Trends = () => {
    const history = useHistory();
    const [news, setNews] = useState([])
    const [topNew, setTopNew] = useState(null)

    const [pageNumber, setPageNumber] = useState(0)

    const elementsPerPage = 4
    const elementsVisited = pageNumber * elementsPerPage
    const pageCount = Math.ceil(news.length / elementsPerPage)

    const getAllNews = async () => {
        return await fetchNews()
    }

    const sortNewsByDate = (a, b) => {
        const aWeight = ( a.comments.length + a.views ) / moment().diff(moment(a.createdAt))
        const bWeight = ( b.comments.length + b.views ) / moment().diff(moment(b.createdAt))
        console.log(aWeight)
        if(aWeight > bWeight)
            return 1
        if(aWeight < bWeight)
            return -1
        return 0
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
            const sortedNews = r.sort(sortNewsByDate)
            setTopNew(sortedNews[0])
            setNews(sortedNews.slice(1))
        })

    },[])
    return (
        <div className="py-10 px-4">
            <div className="max-w-4xl mx-auto flex flex-col items-center font-montserrat font-normal text-black">
                { topNew  && pageNumber === 0 &&
                    <div
                        className="bg-pink w-full h-96 flex flex-col justify-end py-5 mb-10 rounded-md"
                        style={{backgroundImage: topNew.imageLink ? `url(${ topNew.imageLink })` : null, backgroundSize: 'cover'}}>
                        <div className="w-5/6 px-3 py-4 bg-yellow bg-opacity-80 space-y-6">
                            <span className="text-2xl font-semibold" onClick={() => history.push('/news/'+topNew.id)}>
                                { topNew.title }
                            </span>
                            <div className="flex justify-between">
                                <div className="flex space-x-4 md:text-md text-sm">
                                    <span>{topNew.views} просмотров</span>
                                    <span>{topNew.comments.length} комментариев</span>
                                </div>
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                }
                <div className="w-full space-y-3">
                {
                    news.length > 0 && news.slice(elementsVisited, elementsVisited + elementsPerPage).map(item =>
                        <div className="w-full bg-yellow flex rounded-md p-3 justify-between">
                            <div className="flex flex-col justify-between w-1/2">
                                <span className="text-xl font-medium text-wrap" onClick={() => history.push('/news/'+item.id)}>
                                    {item.title}
                                </span>
                                <div className="flex md:flex-row flex-col md:space-x-4 md:text-md text-sm">
                                    <span>{item.views} просмотров</span>
                                    <span>{item.comments.length} комментариев</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <div className="flex flex-col md:justify-end justify-start">
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="md:h-52 md:w-52 h-40 w-40 rounded-md bg-pink">
                                    {item.imageLink &&
                                    <img src={item.imageLink} className="object-cover rounded-md w-full h-full" alt=""/>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                </div>
            </div>
            <ReactPaginate
                previousLabel={'Пред'}
                nextLabel={'След'}
                pageCount={pageCount}
                onPageChange={({selected}) => setPageNumber(selected)}
                containerClassName="flex space-x-5 items-center w-full justify-center py-10 block bottom-0"
                previousLinkClassName="px-3 py-2 text-white bg-pink"
                nextLinkClassName="px-3 py-2 text-white bg-pink"
                pageLinkClassName="px-3 py-2 border b hover:bg-pink hover:text-white"
                activeLinkClassName="bg-pink text-white"
            />
        </div>
    );
};

export default Trends;
