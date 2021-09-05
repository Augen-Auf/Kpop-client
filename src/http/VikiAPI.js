import {$authHost, $host} from './index'


export const createVikis = async (formData) => {
    try {
        const { data } = await $authHost.post('api/vikis', formData, {headers: {'Content-Type': 'multipart/form-data'}});
        return data
    } catch (e) {
        throw Error(e);
    }

};

export const updateVikis = async (vikis_id, formData) => {
    try {
        const { data } = await $authHost.put('api/vikis/' + vikis_id, formData, {headers: {'Content-Type': 'multipart/form-data'}});
        console.log(data)
        return data
    } catch (e) {
        throw Error(e);
    }

};

export const getOneViki = async (id) => {
    try {
        const { data } = await $host.get('api/vikis/' + id);
        return data
    } catch (e) {
        throw Error(e);
    }

};

export const getOneImage = async (id) => {
    try {
        const { data } = await $host.get('api/images/' + id);
        return data
    } catch (e) {
        throw Error(e);
    }

};


export const deleteVikis = async (id) => {
    try {
        const { data } = await $host.delete('api/vikis/' + id);
        return data
    } catch (e) {
        throw Error(e);
    }
}

export const fetchVikis = async  () => {
    const {data} = await $host.get('api/vikis');
    return data
};
