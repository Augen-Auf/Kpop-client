import React, {useState, useRef, useContext, useEffect} from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useForm} from "react-hook-form";
import moment from "moment";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {createVikis, getOneImage, getOneViki, updateVikis} from "../../http/VikiAPI";
import Image from "next/image";


const CreateUpdateViki = observer(() => {

    let { id } = useParams();
    const {user} = useContext(Context);
    const location = useLocation();
    const history = useHistory();
    const isUpdate = location.pathname.split('/').includes('update')


    const [artistInfo, setArtistInfo] = useState('')
    const [vikiImage, setVikiImage] = useState()

    const {register, handleSubmit, formState: { errors }, setValue} = useForm();

    const getViki = async (id) => {
        return await getOneViki(id)
    }

    const removeImage = () => {
        setVikiImage(null)
        setValue('image', undefined)
    }

    const uploadImage = (e) => {
        const image = e.target.files[0]
        if(image) {
            setValue('image', image)
            setVikiImage(URL.createObjectURL(image))
        }
    }

    const urlToFile = (url) =>{
        return (fetch(url)
                .then((res) => res.arrayBuffer())
                .then((buf) => new File([buf], 'image.png', {type:'image/png'}))
        );
    }

    useEffect(() => {
        if(isUpdate) {
            getViki(id).then(r => {
                setArtistInfo(r.info)
                setValue('artistName', r.name)
                setValue('shortDescription', r.short_description)
                setValue('birthday', moment(r.birthday).format('YYYY-MM-DD'))
                if(r.image_id) {
                    console.log()
                    setVikiImage(process.env.REACT_APP_API_URL + 'api/images/' + r.image_id)
                    urlToFile(process.env.REACT_APP_API_URL + 'api/images/' + r.image_id).then(r => {
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

    const handleChange = (value) => {
        console.log(value)
        setArtistInfo(value)
    }

    const addUpdateViki = async({artistName, shortDescription, birthday, image}) => {
        const formData = new FormData()
        formData.append('name', artistName)
        formData.append('short_description', shortDescription)
        formData.append('birthday', birthday)
        formData.append('info', artistInfo)
        formData.append('author_id', user.user.id)
        formData.append('image', image)
        if(isUpdate) {
            const newsData  = await updateVikis(id, formData);
            history.push('/vikis/' + newsData.id)
        }
        else {
            const newsData = await createVikis(formData);
            history.push('/vikis/' + newsData.id)
        }
    }


    return (
        <div className="justify-center font-montserrat font-normal" >
            <div className="flex flex-grow justify-center mt-10">
                <div className="md:w-4/6 w-full p-5 bg-white min-h-3/4 mb-10 shadow-md rounded-md">
                    <form onSubmit={handleSubmit(addUpdateViki)}>
                        <div className="mb-4">
                            <label>Исполнитель</label>
                            <input
                                className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-pink"
                                { ...register("artistName", {required: 'Обязательное поле для заполнения'})}/>
                            {errors.artistName && <span className="text-red-500"> { errors.artistName.message } </span>}
                        </div>
                        <div className="mb-4">
                            <label>Краткое описание</label>
                            <input className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-pink"
                                   { ...register("shortDescription", {required: 'Обязательное поле для заполнения'})}/>
                            {errors.shortDescription && <span className="text-red-500"> { errors.shortDescription.message } </span>}
                        </div>
                        <div className="mb-4">
                            <label>Дата рождения</label>
                            <input className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-pink" type="date"
                                   { ...register("birthday", {required: 'Обязательное поле для заполнения'})}/>
                        </div>
                        <div className="mb-4">
                            <div>
                                {vikiImage &&
                                    <div className="flex space-x-4 justify-center">
                                        <div className="bg-gray-400 aspect-w-16 aspect-h-8 w-1/2 rounded-md">
                                            <img src={vikiImage} alt="" className="rounded-md object-cover"/>
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
                            <label>Об исполнителе</label>
                            <ReactQuill onChange={handleChange} modules={modules} formats={formats} value={artistInfo}/>
                        </div>
                        <div className=" flex justify-between">
                            <button type="button" className="py-2 px-3 bg-yellow rounded-md focus:outline-none">
                                Отменить
                            </button>
                            <button type="submit" className="py-2 px-3 bg-pink rounded-md focus:outline-none">
                                {isUpdate ? 'Обновить вики-страничку' : 'Добавить вики-страничку'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
});

export default CreateUpdateViki
