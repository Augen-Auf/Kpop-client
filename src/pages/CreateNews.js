import React, {useState, useRef, useContext, useEffect} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Tag from '../components/Tag'
import {useForm} from "react-hook-form";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {createNews, getOneNew, updateNews} from "../http/NewsAPI";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {PROFILE_ROUTE} from "../utils/consts";


const CreateNews = observer(() => {

    let { id } = useParams();
    const {user} = useContext(Context);
    const location = useLocation();
    const history = useHistory();
    const isUpdate = location.pathname.split('/').includes('update')

    const [newsImage, setNewsImage] = useState()
    const [text, setText] = useState('')
    const [tags, setTags] = useState([])

    const {register, handleSubmit, formState: { errors }, setValue} = useForm();

    const getNew = async (id) => {
        return await getOneNew(id)
    }

    useEffect(() => {
        if(isUpdate) {
            getNew(id).then(r => {
                const { news } = r
                setText(news.text)
                setTags(news.tags.map( item => item.tag))
                setValue('lid', news.lid)
                setValue('title', news.title)

                if(news.image_id) {
                    console.log()
                    setNewsImage(process.env.REACT_APP_API_URL + 'api/images/' + news.image_id)
                    urlToFile(process.env.REACT_APP_API_URL + 'api/images/' + news.image_id).then(r => {
                        setValue('image', r)
                    })
                }

            })
        }
    },[])

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            [{ 'size': [ 'small', false, 'large', 'huge' ]}],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ]
    }
    const formats = [
        'header', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const tag = useRef(null)

    const urlToFile = (url) =>{
        return (fetch(url)
                .then((res) => res.arrayBuffer())
                .then((buf) => new File([buf], 'image.png', {type:'image/png'}))
        );
    }

    const handleChange = (value) => {
        console.log(value)
        setText(value)
    }

    const removeImage = () => {
        setNewsImage(null)
        setValue('image', undefined)
    }

    const uploadImage = (e) => {
        const image = e.target.files[0]
        if(image) {
            setValue('image', image)
            setNewsImage(URL.createObjectURL(image))
        }
    }

    const addNew = async({title, lid, image}) => {

        const formData = new FormData()
        formData.append('title', title)
        formData.append('lid', lid)
        formData.append('text', text)
        formData.append('type', 'news')
        formData.append('author_id', user.user.id)
        if (tags.length > 0)
            formData.append('tags', tags.join(','))
        formData.append('image', image)

        if(isUpdate) {
            console.log('update')
            const newsData  = await updateNews(id, formData);
            console.log(newsData)
            history.push('/news/'+ newsData.id)
        }
        else {
            const newsData = await createNews(formData);
            history.push('/news/' + newsData.id)
        }
    }

    const removeTagHandler = (tagName) => {
        setTags(tags.filter(el => el !== tagName))
    }
    const addTagHandler = () => {
        const tagName = tag.current.value
        if(tagName && tagName.trim() !== '' && !tags.includes(tagName))
            setTags([...tags, tagName])
        tag.current.value = ''
    }

    return (
        <div className="justify-center font-montserrat font-normal" >
            <div className="flex flex-grow justify-center mt-10">
                <div className="md:w-4/6 w-full p-5 bg-white min-h-3/4 mb-10 shadow-md rounded-md">
                    <form onSubmit={handleSubmit(addNew)}>
                        <div className="mb-4">
                            <label>Заголовок</label>
                            <input
                                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-pink"
                                { ...register("title", {required: 'Обязательное поле для заполнения'})}/>
                            {errors.title && <span className="text-red-500"> { errors.title.message } </span>}
                        </div>
                        <div className="mb-4">
                            <label>Лид</label>
                            <input className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-pink"
                                   { ...register("lid", {required: 'Обязательное поле для заполнения'})}/>
                            {errors.lid && <span className="text-red-500"> { errors.lid.message } </span>}
                        </div>
                        <div className="mb-4">
                            <div>
                                {newsImage &&
                                <div className="flex space-x-4 justify-center">
                                    <div className="bg-gray-400 aspect-w-16 aspect-h-8 w-1/2 rounded-md">
                                        <img src={newsImage} alt="" className="rounded-md object-cover"/>
                                    </div>
                                    <button type="button" className="p-2 bg-pink rounded-md h-10 w-10" onClick={() => removeImage()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                }
                            </div>
                            <label>Изображение</label>
                            <label
                                className="flex justify-center items-center space-x-2 px-4 py-2 bg-white text-pink rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-pink hover:text-white">
                                <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20">
                                    <path
                                        d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"/>
                                </svg>
                                <span className="text-base leading-normal">Выберите фото</span>
                                <input type='file' className="hidden" onChange={(e) => uploadImage(e)}/>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label>Текст</label>
                            <ReactQuill onChange={handleChange} modules={modules} formats={formats} value={text}/>
                        </div>
                        <div className="mb-4 w-full">
                            <div className="flex justify-between">
                                <input
                                    ref={tag}
                                    type="text"
                                    className="appearance-none block w-5/6 bg-white text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter some tags"/>
                                <button
                                    type="button"
                                    className="py-2 px-3 bg-yellow rounded-md focus:outline-none"
                                    onClick={addTagHandler}>
                                    Добавить
                                </button>
                            </div>
                            <div>
                            {tags && tags.map((item, index) => {
                                return <Tag key={'tag_'+index} tagName={item} removeHandler={removeTagHandler}/>
                            })}
                            </div>
                        </div>
                        <div className=" flex justify-between">
                            <button type="button" className="py-2 px-3 bg-yellow rounded-md focus:outline-none" onClick={() =>{history.push(PROFILE_ROUTE)}}>
                                Отменить
                            </button>
                            <button type="submit" className="py-2 px-3 bg-pink rounded-md focus:outline-none">
                                { isUpdate ? 'Обновить новость' : 'Добавить новость'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
});

export default CreateNews
