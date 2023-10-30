import network from '../Network';
import * as Config from '../Configration';

export default {
    //===================Login API ============================//
    loginApi: async (data: any) => {
        console.log("resposnecheck1234",data)
        const response = await network.createApiClient().loginUser(data);
        console.log("resposnecheck",response);
        return response;
    },
};