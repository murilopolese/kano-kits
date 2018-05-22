const uuid = require('uuid');

/**
 * Creates an JSON object with an RPC request
 *
 * @param {String} method RPC method being requested
 * @param {Array} params Array of parameters to send over the RPC request
 * @return {Object}
 */
const rpcRequestObject = (method, params) => {
    return {
        type: "rpc-request",
        id: uuid.v4(),
        method: method,
        params: params
    }
};

/**
 * Creates a stringified JSON object with an RPC request
 *
 * @param {String} method RPC method being requested
 * @param {Array} params Array of parameters to send over the RPC request
 * @return {String}
 */
const rpcRequest = (method, params) => {
    return JSON.stringify(rpcRequestObject(method, params));
};

/**
 * Creates a promise of a RPC request that resolves when the bus emits an RPC
 * response that matches the `id` of the sent request.
 *
 * @param {Object} requestObject JSON object with the RPC request
 * @param {EventEmitter} bus Instance of an event emmiter that is
 * @return {Promise}
 */
const rpcPromise = (requestObject, bus) => {
    return new Promise((resolve, reject) => {
        let rpcResponseHandler = (data) => {
            if(data.id == requestObject.id) {
                bus.removeListener('rpc-response', rpcResponseHandler);
                if(data.error) {
                    reject(new Error(data.error));
                } else {
                    resolve(data);
                }
            }
        };
        bus.on('rpc-response', rpcResponseHandler);
        bus.emit('rpc-request', requestObject);
    });
};

module.exports = {
    rpcPromise: rpcPromise,
    rpcRequest: rpcRequest,
    rpcRequestObject: rpcRequestObject
};
