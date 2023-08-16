import { baseAuthApi } from './api';

export const constructionSitesUrlEndpoint = '/constructionSites';

export const getConstructionSites = async () => {
    const response = await baseAuthApi.get(constructionSitesUrlEndpoint);
    const transformedData = response.data?.map(constructionSite => {
        return {
            ...constructionSite,
            id: constructionSite._id
        }
    })
    return transformedData;
}

export const addConstructionSite = async (constructionSite) => {
    const response = await baseAuthApi.post(constructionSitesUrlEndpoint, constructionSite);
    return response.data;
}

export const updateConstructionSite = async (constructionSite) => {
    const response = await baseAuthApi.patch(`${constructionSitesUrlEndpoint}/${constructionSite.id || constructionSite._id}`, constructionSite)
    return response.data;
}

export const deleteConstructionSite = async (constructionSiteId) => {
    return await baseAuthApi.delete(`${constructionSitesUrlEndpoint}/${constructionSiteId}`)
}