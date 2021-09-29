import React, { Fragment, useContext, useState, useEffect } from 'react';
import {Context} from "../../index";
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import {observer} from "mobx-react-lite";
import UserNews from "./UserNews";
import UserVikis from "./UserVikis";
import UserComments from "./UserComments";
import UpdateProfileForm from "./UpdateProfileForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import {getComments, getNews, getVikis} from "../../http/userAPI";

const Profile = observer(() => {

    const {user} = useContext(Context);

    const [isOpen, setIsOpen] = useState(false)
    const [dialogForm, setDialogForm] = useState()
    const [userComments, setUserComments] = useState(0)
    const [userNews, setUserNews] = useState(0)
    const [userVikis, setUserVikis] = useState(0)

    const getUserNews = async (id) => {
        return await getNews(id)
    }

    const getUserComments = async (id) => {
        return await getComments(id)
    }

    const getUserVikis = async (id) => {
        return await getVikis(id)
    }

    useEffect(() => {
        getUserNews(user.user.id).then(r => {
            console.log(r)
            setUserNews(r && r.length > 0  ? r.length : 0)
        });
        getUserVikis(user.user.id).then(r => {
            console.log('articles', r)
            setUserVikis(r && r.length > 0 ? r.length : 0)
        })
        getUserComments(user.user.id).then(r => {
            setUserComments(r && r.length > 0  ? r.length : 0)
        })
    }, [])

    const sections = [
        {title: 'Новости', section: 'news', component: <UserNews userId={user.user.id}/>},
        {title: 'Вики', section: 'vikis', component: <UserVikis userId={user.user.id}/>},
        {title: 'Комментарии', section: 'comments', component: <UserComments userId={user.user.id}/> }
    ]

    const dialogs = {
        'updateProfile': <UpdateProfileForm openForm={setIsOpen}/>,
        'updatePassword': <UpdatePasswordForm openForm={setIsOpen}/>
    }

    const [section, setSection] = useState(sections[0])

    const openDialog = (dialogFormName) => {
        setDialogForm(dialogFormName);
        setIsOpen(true);
    }

    return (
        <>
            <div className={`w-full z-0 font-montserrat font-normal ${isOpen ? 'px-10' : 'px-10'} py-14`}>
                <div className="flex lg:flex-row flex-col w-full h-full justify-center lg:space-x-10 lg:space-y-0 space-y-10">
                    <aside className="lg:w-1/5 lg:sticky h-1/3 lg:top-10">
                        <div className="flex flex-col space-y-4">
                            <div className="bg-yellow rounded-md shadow-md ">
                                <div className="flex flex-col px-3 py-4 space-y-5 text-black">
                                    <div className="rounded-full lg:w-48 lg:h-48 w-32 h-32 mx-auto bg-pink">
                                        {user.user.avatarId &&
                                        <img src={ user.user.avatarId ? process.env.REACT_APP_API_URL + 'api/avatar/' + user.user.avatarId : 'img/Sunmi.jpg' } className="object-cover h-full w-full rounded-full"/>
                                        }
                                    </div>
                                    <div>
                                        <p className="text-center text-2xl font-semibold">{user.user.name}</p>
                                        <p className="text-center text-md">{user.user.email}</p>
                                    </div>
                                    <div className="flex justify-center space-x-4 bg-orange-200 rounded-md py-2">
                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-medium">{ userNews }</span>
                                            <span className="text-xs">новостей</span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-medium">{userVikis}</span>
                                            <span className="text-xs">вики</span>
                                        </div>
                                        <div className="flex flex-col justify-center items-center">
                                            <span className="text-2xl font-medium">{userComments}</span>
                                            <span className="text-xs">комментов</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-pink text-lg rounded-md py-2 shadow-md focus:outline-none" onClick={() => openDialog('updateProfile')}>
                                Редактировать
                            </button>
                            <button className="bg-pink text-lg rounded-md py-2 shadow-md focus:outline-none" onClick={() => openDialog('updatePassword')}>
                                Сменить пароль
                            </button>
                        </div>
                    </aside>
                    <main className="lg:w-4/6">
                        <div className="flex flex-col w-full h-full">
                            <Listbox className="mb-4 md:hidden block" value={section} onChange={setSection}>
                                <div className="relative mt-1">
                                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                        <span className="block truncate">{section.title}</span>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                          <SelectorIcon
                                              className="w-5 h-5 text-gray-400"
                                              aria-hidden="true"
                                          />
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="mt-3 py-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {sections.map((item, itemIdx) => (
                                                <Listbox.Option
                                                    key={itemIdx}
                                                    className={({ active }) =>
                                                        `${active ? 'text-orange-900 bg-orange-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-10 pr-4`
                                                    }
                                                    value={item}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                          <span
                                                              className={`${
                                                                  selected ? 'font-medium' : 'font-normal'
                                                              } block truncate`}
                                                          >
                                                            { item.title }
                                                          </span>
                                                            {
                                                                selected ?
                                                                    (
                                                                        <span className={`${active ? 'text-orange-600' : 'text-orange-600'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                                        <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                                                    </span>
                                                                    ) : null
                                                            }
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                            <div className="flex space-x-5 text-lg uppercase font-montserrat md:block hidden">
                                { sections.map(item =>
                                    <button className="bg-pink px-3 py-2 rounded-t-md focus:outline-none" onClick={() => setSection(item)}>
                                        { item.title }
                                    </button>
                                )}
                            </div>
                            <div className="bg-yellow flex flex-col w-full h-full shadow-md md:rounded-b-md rounded">
                                <div className="flex space-x-5 text-lg font-montserrat md:visible invisible">
                                    { sections.map(item =>
                                        <div className={`bg-pink px-3 h-3 ${ section.section === item.section ? '': 'invisible'}`}>
                                            <p className="invisible">{ item.title }</p>
                                        </div>
                                    )}
                                </div>
                                { section.component }
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <Transition appear show={isOpen} as={Fragment}>

                <Dialog
                    className="fixed inset-0 z-100 overflow-auto"
                    open={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="min-h-screen text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-59"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-59"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-60" />
                        </Transition.Child>
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                              &#8203;
                            </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                { dialogs[dialogForm] }
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
});

export default Profile;
