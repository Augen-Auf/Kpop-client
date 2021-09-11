import React, {useContext, useEffect, useState} from 'react';
import {Dialog} from "@headlessui/react";
import {EMAIL_REGEX} from "../../utils/consts";
import {useForm} from "react-hook-form";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {getAvatar, updateUser} from "../../http/userAPI";

const UpdateProfileForm = observer(({openForm}) => {

    const {user} = useContext(Context);
    const [avatar, setAvatar] = useState(user.user.avatarId ? process.env.REACT_APP_API_URL + 'api/avatar/' + user.user.avatarId : null)
    const [avatarAction, setAvatarAction] = useState(null)

    const {register, handleSubmit, formState: { errors }, setValue} = useForm({
        defaultValues: {
            name: user.user.name,
            email: user.user.email
        }
    });

    const removeAvatar = () => {
        setAvatar(null)
        setAvatarAction('remove')
    }
    const changeAvatar = (e) => {
        console.log(e.target.files);
        setAvatarAction('set')
        setValue('avatarImage', e.target.files[0])
        setAvatar(URL.createObjectURL(e.target.files[0]))
    }

    const changeUserData = async ({name, email, avatarImage}) => {
        const userData = await updateUser(user.user.id, name, email, avatarImage, avatarAction)
        user.setUser(userData);
        openForm(false)
    }

    const close = () => {
        setValue('name', user.user.name);
        setValue('email', user.user.email);
        openForm(false)
    }


    return (
        <>
            <Dialog.Title as="p" className="text-lg font-semibold">Редактировать профиль</Dialog.Title>
            <div className="flex flex-col space-y-3">
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit(changeUserData)}>
                    <div>
                        <div className="mx-auto bg-gray-400 aspect-w-16 aspect-h-8 w-1/2 rounded-md">
                            { avatar ? <img src={avatar} alt="" className="rounded-md object-cover"/> : null }
                        </div>
                    </div>
                    <div className="flex flex-col w-full space-y-2">
                        <label>Аватар</label>
                        <label
                            className="flex justify-center items-center space-x-2 px-4 py-2 bg-white text-pink rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-pink hover:text-white">
                            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path
                                    d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"/>
                            </svg>
                            <span className="text-base leading-normal">Выберите фото</span>
                            <input type='file' className="hidden" onChange={(e) => changeAvatar(e)}/>
                        </label>
                        <button type="button" className="px-3 py-2 bg-pink rounded-md" onClick={() => removeAvatar()}>Сбросить</button>
                    </div>

                    <div className="flex flex-col w-full">
                        <label>Имя</label>
                        <input className="px-3 py-2 border rounded-md"
                               {...register('name', {required: "Поле имя не заполнено"})}/>
                    </div>

                    <div className="flex flex-col w-full">
                        <label>Почта</label>
                        <input className="px-3 py-2 border rounded-md"
                               {...register('email', {
                                required: "Поле email не заполнено",
                                pattern: {value: EMAIL_REGEX, message:"В поле введен не email"}
                        })}/>
                    </div>

                    <div className="flex space-x-5">
                        <button className="px-3 py-2 bg-pink rounded-md" type="button" onClick={() => close()}>Закрыть</button>
                        <button className="px-3 py-2 bg-pink rounded-md" type="submit">Изменить</button>
                    </div>
                </form>
            </div>
        </>
    );
});

export default UpdateProfileForm;
