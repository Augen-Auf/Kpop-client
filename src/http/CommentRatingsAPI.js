import {$host} from "./index";
export const getCommentRatings = async (commentId) => {
    try {
        const { data } = await $host.get(`api/comments/${commentId}/ratings`);
        return data
    } catch (e) {
        throw Error(e);
    }
}

export const setCommentRating = async (commentId, userId, choice, action) => {
    try {
        const { data } = await $host.post(`api/comments/${commentId}/ratings/set`, {userId, action, choice});
        return data
    } catch (e) {
        throw Error(e);
    }
}
