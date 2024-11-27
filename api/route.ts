/**
 * API 路由
 * @description 的 API 路由
 */
export const API_ROUTES = {
    ACCOUNT: {
        LOGIN: '/account/loginAccount',
        REGISTER: '/account/registerAccount',
        LOGOUT: '/account/logoutAccount',
        PROFILE: '/account/getUserProfile',
        RESET_PASSWORD: '/account/resetPassword',
        SEND_EMAIL_VERIFICATION_CODE: '/account/sendEmailVerificationCode',
        GEN_IMG_VERIFICATION_CODE: '/account/genImgVerificationCode',
    },
    POST: {
        GET_ALL_POSTS: '/post/getAllPosts',
        GET_ONE_POST: '/post/getOnePost',
        CREATE_ONE_POST: '/post/createOnePost',
        UPDATE_ONE_POST: '/post/updateOnePost',
        DELETE_ONE_POST: '/post/deleteOnePost',
    }
} as const;