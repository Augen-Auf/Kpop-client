import React, {useContext, useEffect, useState} from 'react';
import {useParams, useLocation} from "react-router-dom";
import {getOneNew} from "../http/NewsAPI";
import moment from "moment";
import 'moment/locale/ru'
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import Comments from "../components/Comments";
import NewsReactions from "../components/NewsReactions";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ReactTooltip from "react-tooltip";
import {Link} from 'react-scroll'

const NewsPage = observer(() => {
    let { id } = useParams();
    const location = useLocation();

    const {user} = useContext(Context);

    const [newsObj, setNewsObj] = useState();
    const [loadedImages, setLoadedImages] = useState([]);

    const getNew = async () => {
        return await getOneNew(id)
    }

    const transformToHTML = (text) => {
        return {__html: text}
    }


    useEffect(() => {
        getNew().then( ({news}) => {
                console.log(news)
                news.createdAt = moment(news.createdAt).format('DD.MM.YYYY')
                setNewsObj(news)
            }
        )
    }, []);

    return (
        <div className="w-full">
            {newsObj &&
                <>
                    <header className="bg-pink">
                        <div className="max-w-5xl mx-auto py-6 px-10">
                            <h1 className="text-3xl font-medium text-gray-900">{ newsObj.title }</h1>
                        </div>
                    </header>
                    <ReactTooltip id="copiedTip"
                                  place="left"
                                  className='bg-pink text-white'
                                  event='click'
                                  delayHide={2000}
                                  effect='solid'
                                  afterShow={() => ReactTooltip.hide()}
                    >
                        <span>Скопировано!</span>
                    </ReactTooltip>
                    <div className="max-w-5xl container mx-auto px-10 py-3 space-y-3">
                        {/*Хлебные крошки*/}
                        <div className="flex justify-between">
                            <div className="flex space-x-4">
                                <CopyToClipboard text={'http://localhost:3000' + location.pathname}>
                                    <button data-for="copiedTip" data-tip className="focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                        </svg>
                                    </button>
                                </CopyToClipboard>
                                <Link to="commentSection" smooth={true} duration={700} className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                            <div className="flex flex-col items-end">
                                <span>{ newsObj.user.name }, { newsObj.createdAt }</span>
                                <span>{ newsObj.views } просмотров</span>
                            </div>
                        </div>

                        {/*Лид*/}
                        <div className="text-2xl">{newsObj.lid}</div>

                        {/*Содержание статьи*/}
                        <div dangerouslySetInnerHTML={transformToHTML(newsObj.text)} className="text-xl landing-6 space-y-4"/>

                        {/*Теги*/}
                        <div className="space-y-2">
                            <p className="text-xl font-semibold">Теги</p>
                            <div className="flex flex-wrap space-x-4">
                                {
                                    newsObj.tags.map( item =>
                                        <div className="px-3 py-2 border rounded-md bg-white">
                                            {item.tag}
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        {/*Эмодзи*/}
                        {user.user.id &&
                            <div className="flex justify-center ">
                                <NewsReactions userId={user.user.id} newsId={id}/>
                            </div>
                        }
                        {/*Комментарии*/}
                        <div id="commentSection">
                         <Comments newsId={id}/>
                        </div>
                    </div>
                </>
            }
        </div>
    );
});

export default NewsPage
