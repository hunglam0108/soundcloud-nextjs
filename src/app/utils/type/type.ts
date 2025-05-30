export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface DataMusicType {
        _id: string
        category: string
        countLike: number
        countPlay: number
        createdAt: string
        description: string
        imgUrl: string
        isDeleted: boolean
        title: string
        trackUrl: string
        updatedAt: string
        uploader: {
            _id: string
            email: string
            name: string
            role: string
            type: string
        }
        __v: string
    }

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

}