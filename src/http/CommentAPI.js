import {$authHost, $host} from './index'


export const getNewsComments = async (publication_id) => {
    try {
        const { data } = await $host.get(`api/news/${publication_id}/comments`)
        return data
    } catch (e) {
        throw Error(e);
    }
}

export const createComment = async (publication_id, user_id, text, parentId) => {
    try {
        const { data } = await $host.post('api/comments/', {publication_id, user_id, text, parent_id:parentId});
        console.log(data)
        return data
    } catch (e) {
        throw Error(e);
    }
};
