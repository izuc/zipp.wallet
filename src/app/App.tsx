import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import logoHeader from "../assets/logo-header.svg";
import closeWindow from "../assets/close-app.svg";
import maximizeWindow from "../assets/maximize.svg";
import minimizeWindow from "../assets/minimize.svg";
import settings from "../assets/settings.svg";
import { ServiceFactory } from "../factories/serviceFactory";
import { ElectronHelper } from "../helpers/electronHelper";
import { ISettingsService } from "../models/services/ISettingsService";
import { IWalletService } from "../models/services/IWalletService";
import "./App.scss";
import { AppProps } from "./AppProps";
import { AppState } from "./AppState";
import Settings from "./components/Settings";
import Wallet from "./components/Wallet";

const remote = window.require("electron").remote;
/**
 * Main application class.
 */
class App extends Component<AppProps, AppState> {
    /**
     * Settings service.
     */
    private readonly _settingsService: ISettingsService;

    /**
     * Wallet service.
     */
    private readonly _walletService: IWalletService;

    /**
     * Create a new instance of App.
     * @param props The props.
     */
    constructor(props: AppProps) {
        super(props);

        this._settingsService = ServiceFactory.get<ISettingsService>("settings");
        this._walletService = ServiceFactory.get<IWalletService>("wallet");

        this.state = {
            displayMode: "wallet"
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        const wallet = await this._walletService.get();
        const settings = await this._settingsService.get();
        this.setState({
            wallet,
            settings
        });
    }

    /**
     * Minimize window.
     */
    public minimize(): void {
        remote.getCurrentWindow().minimize();
    }

    /**
     * Maximize/unmaximize window.
     */
    public maximize(): void {
        if (remote.getCurrentWindow().isMaximized()) {
            remote.getCurrentWindow().unmaximize();
        } else {
            remote.getCurrentWindow().maximize();
        }
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className={`app 
                ${(!this.state.wallet || !this.state.wallet.seed) ? "bg-gradient" : ""}`}>
                <header>
                    <Link className="brand" to="/">
                        <img src={logoHeader} alt="ZIPP Logo" />
                    </Link>
                    {ElectronHelper.isElectron() && (
                        <div className="window-controllers row">
                            <button
                                onClick={() => this.minimize()}
                            >
                                <img src={minimizeWindow} alt="minimize window" />
                            </button>
                            <button
                                onClick={() => this.maximize()}
                            >
                                <img src={maximizeWindow} alt="maximize window" />
                            </button>
                            <button
                                onClick={() => window.close()}
                            >
                                <img src={closeWindow} alt="close window" />
                            </button>
                        </div>
                    )}
                </header>
                <div className={`content 
                ${(!this.state.wallet || !this.state.wallet.seed) ? "relative overflow-hidden" : ""}`}>

                    {this.state.displayMode === "settings" && (
                        <Settings
                            isDev={(process.env.NODE_ENV === "development" ? true : false)}
                            onClose={settings => this.setState({
                                settings: settings ?? this.state.settings,
                                displayMode: "wallet"
                            })}
                        />
                    )}
                    {this.state.displayMode === "wallet" && (
                        <Wallet onUpdated={
                            async () => this.setState({
                                wallet: await this._walletService.get()
                            })
                        } displayNodeMessage={(!this.state.wallet || (this.state.wallet && !this.state.wallet.seed))} />
                    )}
                    {this.state.displayMode === "delete-wallet" && (
                        <div className="card">
                            <div className="card--header">
                                <h2>Delete Wallet</h2>
                            </div>
                            <div className="card--content">
                                <p className="margin-b-s">
                                    Are you sure you want to delete the wallet?
                                </p>
                                <button
                                    className="button--danger margin-r-s"
                                    onClick={() => this.deleteWallet()}
                                >
                                    Yes
                                </button>
                                <button
                                    className="button--secondary"
                                    onClick={() => this.setState({
                                        displayMode: "wallet"
                                    })}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <footer className="row space-between middle">
                    <div>
                        <img src={settings} alt="Settings" onClick={() => this.setState({ displayMode: "settings" })} />
                    </div>
                    <span className="margin-r-s">v{process.env.REACT_APP_VERSION}</span>
                    <div>
                        <button
                            disabled={this.state.displayMode !== "wallet" || !this.state.wallet}
                            className="button--danger"
                            onClick={() => this.setState({ displayMode: "delete-wallet" })}
                        >
                            Delete Wallet
                        </button>
                    </div>

                </footer>
            </div >
        );
    }

    /**
     * Delete a wallet using the service.
     */
    private async deleteWallet(): Promise<void> {
        await this._walletService.delete();
        this.setState({
            displayMode: "wallet",
            wallet: undefined
        });
    }
}

export default App;
