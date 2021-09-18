import React, {useContext, useState} from 'react';
import { NavLink, useLocation, useHistory  } from "react-router-dom"
import {useForm} from "react-hook-form";
import {observer} from "mobx-react-lite";
// import * as yup from 'yup'


import {EMAIL_REGEX, LOGIN_ROUTE, NEWS_ROUTE, PORTAL_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import {login, registration} from "../http/userAPI";
import {Context} from "../index";

const Auth = observer(() => {

    const { user } = useContext(Context);
    const [authError, setAuthError] = useState(null);

    const location = useLocation();
    const history = useHistory();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const {register, handleSubmit, formState: { errors }} = useForm();



    const onSubmit = async (data) => {
        try {
            setAuthError(null)

            let user_data;
            if (isLogin) {
                user_data = await login(data.email, data.password).catch(err => { throw err })
            } else {
                user_data = await registration(data.email, data.password, data.name).catch(err => { throw err })
            }

            console.log(user_data);
            if(authError === null) {
                user.setUser(user_data);
                user.setIsAuth(true);
                history.push(NEWS_ROUTE)
            }
        }
        catch (e) {
            setAuthError(e.message);
        }
    };

    return (
        <div
            className="mx-auto h-5/6 items-center flex justify-center flex-col font-montserrat font-normal">
            <div className="max-w-md w-full mx-auto mt-4">
                <div className="bg-pink p-8 rounded-md">
                <h3 className="text-center text-2xl">{ isLogin ? 'Авторизация' : 'Регистрация' }</h3>
                    <form action="" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="" className="text-black block">Email</label>
                            <input className={`w-full p-2 rounded-md ${errors.email ? "border-2 border-red-500" : ""}`}
                                   {...register('email', {
                                       required: "Поле email не заполнено",
                                       pattern: {value: EMAIL_REGEX, message:"В поле введен не email"}
                                   })}/>
                            {errors.email && <p className="text-red-500"> { errors.email.message } </p>}
                        </div>
                        {
                            !isLogin ?
                                <div>
                                    <label htmlFor="" className="text-black block">Имя</label>
                                    <input className={`w-full p-2 rounded-md ${errors.name ? "border-2 border-red-500" : ""}`}
                                           type="text"
                                           {...register('name', {required: "Поле имя не заполнено"})}/>
                                    {errors.name && <p className="text-red-500"> { errors.name.message } </p>}
                                </div>
                                :
                                null
                        }
                        <div>
                            <label htmlFor="" className="text-black block">Пароль</label>
                            <input className={`w-full p-2 rounded-md ${errors.password ? "border-2 border-red-500" : ""}`}
                                   type="password"
                                   {...register('password', {required: "Поле пароль не заполнено"})}/>
                            {errors.password && <p className="text-red-500"> { errors.password.message } </p>}
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-yellow rounded-md text-black">
                            { isLogin ? 'Войти' : 'Зарегестрироваться' }
                        </button>
                    </form>
                </div>

            <div className="mt-5 text-center">
                {isLogin ?
                    <p>Нет аккаунта?  <NavLink to={REGISTRATION_ROUTE} className="font-medium text-pink-dark">
                            Зарегистрируйтесь!
                        </NavLink>
                    </p>
                    :
                    <p>Есть аккаунт?  <NavLink to={LOGIN_ROUTE} className="font-medium text-pink-dark">
                            Войти!
                        </NavLink>
                    </p>
                }
            </div>
            {/*<div className="bg-yellow rounded-md px-2 py-1 flex justify-center items-center space-x-2">*/}
            {/*    <div className="inline-block">*/}
            {/*        <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google"*/}
            {/*             className="svg-inline--fa fa-google fa-w-16 text-pink h-10 w-90" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">*/}
            {/*            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>*/}
            {/*        </svg>*/}
            {/*    </div>*/}
            {/*    <div className="inline-block">*/}
            {/*        <p>Зарегистрироваться через Google</p>*/}
            {/*    </div>*/}
            {/*</div>*/}
            </div>
                {authError ? (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5" role="alert">
                       <strong className="font-bold">Ошибка! </strong>
                       <span className="block sm:inline mr-10">{ authError }</span>
                       <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg onClick={() => setAuthError(null)} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 20 20"><title>Close</title><path
                            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                   </div>) :
                        null
                }


        </div>
    );
});

export default Auth;
