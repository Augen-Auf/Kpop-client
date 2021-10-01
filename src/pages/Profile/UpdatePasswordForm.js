import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Dialog} from "@headlessui/react";
import {useForm} from "react-hook-form";

import { changePassword } from "../../http/userAPI";
import {Context} from "../../index";
import {LOGIN_ROUTE} from "../../utils/consts";
import {useHistory} from "react-router-dom";

const UpdatePasswordForm = observer(({openForm}) => {

    const {user} = useContext(Context);
    const history = useHistory();
    const {register, handleSubmit, formState: { errors }, setValue, getValues} = useForm();

    const changeOldPassword = async ({oldPassword, newPassword}) => {
        try {
            await changePassword(user.user.id, oldPassword, newPassword)
            openForm(false)
            history.push(LOGIN_ROUTE)
        }
        catch (e) {
            console.log(e)
        }
    }

    const notEqual = () => !getValues(['oldPassword', 'newPassword']).every( (val, i, arr) => val === arr[0] )

    const close = () => {
        setValue('oldPassword', '');
        setValue('newPassword', '');
        openForm(false)
    }

    return (
        <div>
            <Dialog.Title as="p" className="mb-4 font-semibold text-lg">Изменить пароль</Dialog.Title>
            <div className="flex flex-col space-y-3">
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit(changeOldPassword)}>
                    <div className="flex flex-col w-full">
                        <label>Старый пароль</label>
                        <input className="px-3 py-2 border rounded-md focus:outline-none focus:border-pink"
                               {...register('oldPassword',
                                   {
                                       required: "Поле старый пароль не заполнено",
                                   })}/>
                    </div>

                    <div className="flex flex-col w-full">
                        <label>Новый пароль</label>
                        <input className="px-3 py-2 border rounded-md focus:outline-none focus:border-pink"
                               {...register('newPassword', {
                                   required: "Поле новый пароль не заполнено",
                                   validate: notEqual
                               })}/>
                    </div>

                    <div className="flex space-x-5">
                        <button className="px-3 py-2 bg-pink rounded-md focus:outline-none" type="button" onClick={() => close()}>Закрыть</button>
                        <button className="px-3 py-2 bg-pink rounded-md focus:outline-none" type="submit">Изменить</button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default UpdatePasswordForm;
