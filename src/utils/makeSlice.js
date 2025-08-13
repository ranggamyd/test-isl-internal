import { encrypt } from './Crypto';

const makeSlice = (controller, nameFunction) => {
    const obj = {
        controller: controller,
        function: nameFunction,
    };

    const objString = JSON.stringify(obj);
    const encryptedString = encrypt(objString);
    return encryptedString;
};

export default makeSlice;