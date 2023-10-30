
export default (api: any) => {
    api.axiosInstance.interceptors.response.use(
        (response: any) => {
            if (__DEV__) {
                 
            }
            return { data: response.data, status: true };
        },

        (error: any) => {
            if (__DEV__) {   
            }
            return { data: error?.response?.data ?? "", status: false }
        },
    );
};
