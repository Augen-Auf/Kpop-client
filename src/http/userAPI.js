import {$authHost, $host} from './index'
import jwt_decode from 'jwt-decode'

export const registration = async  (email, password, name) => {
    try {
        const {data} = await $host.post('api/user/registration', {email, password, name, role: null})
        console.log(data);
        localStorage.setItem('token', data.token);
        return jwt_decode(data.token)
    }
    catch (e) {
       throw new Error(e.response.data.message)
    }
};

export const login = async  (email, password) => {
    try {
        const {data} = await $host.post('api/user/login', {email, password});
        localStorage.setItem('token', data.token);
        console.log(data);
        return jwt_decode(data.token)
    }
    catch (e) {
        throw new Error(e.response.data.message)
    }
};

export const check = async  () => {
    try {
        const {data} = await $authHost.get('api/user/auth');
        localStorage.setItem('token', data.token);
        return jwt_decode(data.token)
    }
    catch (e) {
        return null
    }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    console.log(userId)
    try {
        const { data } = await $authHost.post('api/user/password/change', {userId, oldPassword, newPassword});
        localStorage.removeItem('token');
    }
    catch (e) {
        throw new Error(e.response.data.message)
    }
}

export const updateUser = async (userId, name, email, avatar, avatarAction) => {
    console.log(userId)
    try {
        let formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('userId', userId)
        formData.append('img', avatar)
        formData.append('avatarAction', avatarAction)

        const { data } = await $authHost.post('api/user/change', formData, {headers: {
                'Content-Type': 'multipart/form-data'
            }});
        console.log('data', data)
        localStorage.setItem('token', data.token);
        return jwt_decode(data.token)
    }
    catch (e) {
        throw new Error(e.response.data.message)
    }
}

export const getAvatar = async (id) => {
    try {
        const { data } = await $authHost.get('api/avatar/' + id);
        return data
    }
    catch (e) {
        throw new Error(e.response.data.message)
    }
}

export const getNews = async (id) => {
    const { data } = await $authHost.post(`api/user/news`, {userId: id})
    console.log(data)
    return data
}

export const getComments = async (id) => {
    const { data } = await $authHost.post(`api/user/comments`, {userId: id})
    console.log(data)
    return data
}

export const getArticles = async (id) => {
    const { data } = await $authHost.post(`api/user/articles`, {userId: id})
    console.log(data)
    return data
}

export const getVikis = async (id) => {
    const { data } = await $authHost.post(`api/user/vikis`, {userId: id})
    console.log(data)
    return data
}

