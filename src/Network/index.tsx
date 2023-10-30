import SharedManager from "../Common/SharedManager.tsx";
import { URIS, URI_METHODs } from '../Configration';
import apiMonitor from './monitor';
import setInterceptor from './interceptor';
import { create } from 'apisauce';

const createApiClient = () => {
    
    //===================== Headers =========================//
    const instance = create({
        baseURL: URIS.DEVELOPMENT,
        timeout: 150000,
        headers: {
            "Content-Type": 'application/json',
            //@ts-ignore            
            'Authorization': 'Bearer ' + SharedManager.getInstance().getToken()
        },
        
    });
    instance.addMonitor(apiMonitor);
    setInterceptor(instance);
    const loginUser = (payload: any) => instance.post(URI_METHODs.LOGIN, payload);
    const mobileInput = (payload: any) => instance.post(URI_METHODs.MOBILE, payload);
    const otpVerify = (payload: any) => instance.post(URI_METHODs.OTP_VRIFY, payload);
    const userprofile = (payload: any) => instance.post(URI_METHODs.REGISTRATION, payload);
    const coinplan = () => instance.get(URI_METHODs.PLAN);
    const getProfile = () => instance.get(URI_METHODs.PROFILE);
    const dashboardSearch = (payload: any) => instance.post(URI_METHODs.DASHBOARD_SEARCH, payload);
    const forget_password = (payload: any) => instance.post(URI_METHODs.FORGOT_PASSWORD, payload);
    const forgot_otp_verify = (payload: any) => instance.post(URI_METHODs.FORGOT_OTP_VERIFY, payload);
    const send_meetup = () => instance.get(URI_METHODs.SEND_MEETUP);
    const recieve_meetup = () => instance.get(URI_METHODs.RECVIED_MEETUP);
    const reject_meetup = (payload: any) => instance.post(URI_METHODs.REJECT_MEETUP, payload);
    const receiverProfile = (payload: any) => instance.post(URI_METHODs.RECEIVER_PROFILE, payload);
    const sendMeetupReceiverProfile = (payload: any) => instance.post(URI_METHODs.SEND_MEETUP_RECEIVER_PROFILE, payload);
    const ratingList = () => instance.get(URI_METHODs.RATING_LIST);
    const saveRating = (payload: any) => instance.post(URI_METHODs.SAVE_RATING, payload);
    const referalCode = () => instance.get(URI_METHODs.REFERAL);
    const faq = () => instance.get(URI_METHODs.FAQ);
    const staticContent = (payload: any) => instance.post(URI_METHODs.STATIC_PAGE, payload);
    const resetPassword = (payload: any) => instance.post(URI_METHODs.RESET_PASSWORD, payload);
    const resendOtp = (payload: any) => instance.post(URI_METHODs.RESEND_OTP, payload);
    const Add_coins = (payload: any) => instance.post(URI_METHODs.ADD_COIN, payload);
    const Calculate_coins = (payload: any) => instance.post(URI_METHODs.CALCULATE_COINS, payload);
    const withdraw_coins = (payload: any) => instance.post(URI_METHODs.WITHDRAW_COINS, payload);
    const updateProfile = (payload: any) => instance.post(URI_METHODs.UPDATE_PROFILE, payload);
    const verifyEmail = () => instance.get(URI_METHODs.VERIFY_EMAIL);
    const deleteAccount = () => instance.get(URI_METHODs.DELETE_ACCOUNT);
    const contactUs = (payload: any) => instance.post(URI_METHODs.CONTACT_US, payload);
    const Otp_real_meetup = (payload: any) => instance.post(URI_METHODs.OTP_REAL_MEETUP, payload); 
    const Chat_history = (payload: any) => instance.post(URI_METHODs.CHAT_HISTORY, payload); 
    const Meetup_otp_confirm = (payload: any) => instance.post(URI_METHODs.MEETUP_OTP_CONFIRM, payload); 
    const Resend_meetup_otp = (payload: any) => instance.post(URI_METHODs.RESEND_MEETUP_OTP, payload); 
    const meetup_Interaction = () => instance.get(URI_METHODs.MEETUP_INTERACTION);
    const active_chats = () => instance.get(URI_METHODs.ACTIVE_CHAT);
    const Delete_chats = (payload: any) => instance.post(URI_METHODs.DELETE_CHAT, payload); 
    const accept_meetup = (payload: any) => instance.post(URI_METHODs.ACCEPT_MEETUP, payload);
    const coin_transfer = (payload: any) => instance.post(URI_METHODs.COINS_TRANSFER, payload);
    const create_account = (payload: any) => instance.post(URI_METHODs.CREATEACCOUNT, payload);
    const getCountry = () => instance.get(URI_METHODs.COUNTRY);
    const getState = (payload: any) => instance.post(URI_METHODs.STATE, payload);
    const getCity = (payload: any) => instance.post(URI_METHODs.CITY, payload);
    const socialLogin = (payload: any) => instance.post(URI_METHODs.SOCIALLOGIN, payload);
    const getNotification = () => instance.get(URI_METHODs.NOTIFICATION);
    const getRatingHistory = () => instance.get(URI_METHODs.RATINGHISTORY);
    const onlineStatus = (payload: any) => instance.post(URI_METHODs.ONLINE_OFFLINE, payload);
    const chatStatus = (payload: any) => instance.post(URI_METHODs.CHAT_STATUS, payload);
    const getCities = () => instance.get(URI_METHODs.CITIES);
     return {
        loginUser,
        mobileInput,
        otpVerify,
        userprofile,
        coinplan,
        getProfile,
        dashboardSearch,
        referalCode,
        forget_password,
        faq,
        forgot_otp_verify,
        send_meetup,
        recieve_meetup,
        reject_meetup,
        receiverProfile,
        sendMeetupReceiverProfile,
        ratingList,
        saveRating,
        staticContent,
        resetPassword,
        resendOtp,
        Add_coins,
        Calculate_coins,
        withdraw_coins,
        updateProfile,
        verifyEmail,
        deleteAccount,
        contactUs,
        Otp_real_meetup,
        Chat_history,
        Meetup_otp_confirm,
        Resend_meetup_otp,
        meetup_Interaction,
        active_chats,
        Delete_chats,
        accept_meetup,
        coin_transfer,
        create_account,
        getCountry,
        getState,
        getCity,
        socialLogin,
        getNotification,
        getRatingHistory,
        onlineStatus,
        chatStatus,
        getCities,
    };
};

export default { createApiClient };