import fetch from "node-fetch";
import { IFaucetRequest } from "./models/IFaucetRequest";
import { IFaucetResponse } from "./models/IFaucetResponse";
import { IAllowedManaPledgeResponse } from "./models/IAllowedManaResponse";
import { ISendTransactionRequest } from "./models/ISendTransactionRequest";
import { ISendTransactionResponse } from "./models/ISendTransactionResponse";
import { IUnspentOutputsRequest } from "./models/IUnspentOutputsRequest";
import { IUnspentOutputsResponse } from "./models/IUnspentOutputsResponse";
import { IResponse } from "./models/IResponse";

/**
 * Class to handle API communications.
 */
export class ApiClient {
    /**
     * The end point of the api.
     */
    private readonly _endpoint: string;
    
    /**
     * The user of the api.
     */
     private readonly _user?: string;
    
    /**
     * The password of the api.
     */
     private readonly _password?: string;
    
     /**
     * Create a new instance of ApiClient.
     * @param endPoint The endpoint for the API.
     * @param user The user for the API.
     * @param password The password for the API.
     */
    constructor(endPoint: string, user?: string, password?: string) {
        this._endpoint = endPoint;
        this._user = user;
        this._password = password;
    }

    /**
     * AllowedPledge represents the nodes that mana is allowed to be pledged to.
     * @returns The response from the request.
     */
    public async allowedManaPledge(): Promise<IAllowedManaPledgeResponse> {
        return this.sendRequest<null, IAllowedManaPledgeResponse>(
            "get", "mana/allowedManaPledge");
    }

    /**
     * Make a request to the faucet.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async faucet(request: IFaucetRequest): Promise<IFaucetResponse> {
        return this.sendRequest<IFaucetRequest, IFaucetResponse>(
            "post", "faucet", request);
    }

    /**
     * Get the unspent outputs.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async unspentOutputs(request: IUnspentOutputsRequest): Promise<IUnspentOutputsResponse> {
        return this.sendRequest<IUnspentOutputsRequest, IUnspentOutputsResponse>(
            "post", "ledgerstate/addresses/unspentOutputs", request);
    }

    /**
     * Send a transaction request.
     * @param request The request to send.
     * @returns The response from the request.
     */
    public async sendTransaction(request: ISendTransactionRequest): Promise<ISendTransactionResponse> {
        return this.sendRequest<ISendTransactionRequest, ISendTransactionResponse>(
            "post", "ledgerstate/transactions", request);
    }

    /**
     * Send a request and handle errors.
     * @param verb The HTTP verb to make the request.
     * @param path The path to send the request to.
     * @param request The request to send.
     * @returns The response from the request.
     */
    private async sendRequest<T, U extends IResponse>(
        verb: "put" | "post" | "get" | "delete",
        path: string,
        request?: T | undefined): Promise<U> {
        let response: U;

        try {
            const headers: { [id: string]: string } = {};
            headers["Content-Type"] = "application/json";

            if (this._user && this._password) {
                headers.Authorization = `Basic ${btoa(`${this._user}:${this._password}`)}`;
            }

            let fetchResponse;

            if (verb === "get") {
                fetchResponse = await fetch(
                    `${this._endpoint}/${path}`,
                    {
                        method: "get",
                        headers
                    }
                );
            } else if (verb === "post") {
                fetchResponse = await fetch(
                    `${this._endpoint}/${path}`,
                    {
                        method: "post",
                        headers,
                        body: JSON.stringify(request)
                    }
                );
            } else if (verb === "put") {
                fetchResponse = await fetch(
                    `${this._endpoint}/${path}`,
                    {
                        method: "put",
                        headers,
                        body: JSON.stringify(request)
                    }
                );
            } else if (verb === "delete") {
                fetchResponse = await fetch(
                    `${this._endpoint}/${path}`,
                    {
                        method: "delete",
                        headers
                    }
                );
            }

            if (!fetchResponse) {
                throw new Error("No data was returned from the API");
            } else {
                try {
                    response = await fetchResponse.json();
                } catch (err) {
                    const text = await fetchResponse.text();
                    throw new Error(err.message + "   ---   " + text);
                }
                if (!fetchResponse.ok) {
                    if (response.error) {
                        throw new Error(response.error);
                    } else {
                        const isComError = fetchResponse.status >= 500;
                        let msg = fetchResponse.statusText;

                        if (msg === "Network Error") {
                            msg = "There is a problem communicating with the network";
                        }

                        if (!msg.endsWith(".")) {
                            msg += ".";
                        }

                        if (isComError) {
                            msg += "\n\nPlease try again later.";
                        }

                        throw new Error(msg);
                    }
                }
            }
        } catch (err) {
            throw new Error(`The application is not able to complete the request, due to the following error:\n\n${err.message}`);
        }

        return response;
    }
}
