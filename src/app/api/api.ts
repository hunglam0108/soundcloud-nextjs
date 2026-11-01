import { popupSetContent } from '@/redux/features/popup';
import { Dispatch } from '@reduxjs/toolkit/react';
import axios from 'axios';
import queryString from 'query-string';

export const sendRequest = async <T>(props: IRequest) => {
    let {
        url,
        method,
        body,
        queryParams = {},

        useCredentials = false,
        headers = {},
        nextOption = {},
        formData = false
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? (formData ? body : JSON.stringify(body)) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, {...options}).then(res => {
        if (res.ok) {
            return res.json() as T;
        } else {
            return res.json().then(function (json) {
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const apiFunction = async <T>(props: IRequest) => {
    try {
        const res = await sendRequest<T>(props)
    return { res };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const uploadFile = (token: string) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const bodyParameters = {
        key: "value"
    };

    axios.post( 'http://localhost:8000/api/v1/get_token_payloads', bodyParameters, config)
    .then(console.log).catch(console.log);
}

export const submitUpload = async (
    data: {
        title: string, 
        description: string, 
        trackUrl: string, 
        imgUrl: string, 
        category: string
    },
    token?: string
) => token ? await apiFunction<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
                method: "POST",
                body: data,
                headers: {
                Authorization: `Bearer ${token}`
                }
            }) : undefined

export const postCommentTrack = async (dispatch: Dispatch, commnent: string, currentTime: number, idTrack: string, token?: string) => {
    if(token) {
        const response = await apiFunction<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: "POST",
            body: {
                content: commnent,
                moment: Math.floor(currentTime),
                track: idTrack
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    }
    else {
        const message = 'Please login to use comment feature'
        dispatch(popupSetContent({ message, type: 'error', showMessage: true }))
        return
    }
}

export const likeTrack = async (dispatch: Dispatch, idTrack: string, isLike: boolean, token?: string) => {
    if(token) {
        const response = await apiFunction<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
            method: "POST",
            body: {
                track: idTrack,
                quantity: isLike ? 1: -1
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    }
    else {
        const message = 'Please login to use like feature'
        dispatch(popupSetContent({ message, type: 'error', showMessage: true }))
        return
    }
}

export const getStatusLikeTrack = async (token: string, idTrack: string) => {
    const response = await apiFunction<IBackendRes<IModelPaginate<any>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }

    })
    const listLikeTrack = response?.res?.data?.result
    if(listLikeTrack) {
        const liked = listLikeTrack.find((i) => i._id === idTrack)
        return liked ? true : false
    }
    return false
}

export const increaseViewTrack = async (token: string, idTrack: string) => {
    const response = await apiFunction<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
        method: "POST",
        body: {
            trackId: idTrack
        },
        headers: {
            Authorization: `Bearer ${token}`
        }

    })
    return response
}

export const searchListTrack = async (title?: string) => {
    const response = await apiFunction<IBackendRes<IModelPaginate<DataMusicType>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
        method: "POST",
        body: {
            title: title,
            current: 1,
            pageSize: 100
        }
    })
    return response
}


export const getPlaylistByUser = async (token: string) => {
    const response = await apiFunction<IBackendRes<IModelPaginate<Playlist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        nextOption: {
            next: { tags: ['playlist-by-user'] }
        }
    })
    return response
}

export const addUpdatePlaylist = async (data: { id?: string, title: string, tracks: string[]}, token: string) => {
    if(!data.id) {
        const responsePlaylist = await apiFunction<IBackendRes<Playlist>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
            method: "POST",
            body: {
                title: data.title,
                isPublic: true 
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(responsePlaylist.res?.data?._id) {
            const response = await apiFunction<IBackendRes<IModelPaginate<any>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
                method: "PATCH",
                body: {
                    id: responsePlaylist.res?.data?._id,
                    title: data.title,
                    tracks: data.tracks,
                    isPublic: true 
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        }
    }

    return
}
