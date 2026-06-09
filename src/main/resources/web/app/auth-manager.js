import {LitElement, html, css} from 'lit';
import Keycloak from 'keycloak-js/lib/keycloak.js';
import {RestClient} from '@quarkus/rest';
import {GraphQLClient} from '@quarkus/graphql';
import {JsonRPCClient} from '@quarkiverse/json-rpc';

class AuthManager extends LitElement {

    static properties = {
        _authenticated: {state: true},
        _username: {state: true},
        _roles: {state: true},
        _ready: {state: true},
    };

    static styles = css`
        :host { display: block; }
        .auth-bar {
            display: flex; align-items: center; gap: 12px;
            padding: 12px 16px; background: #f8f9fa; border-radius: 8px; margin-bottom: 16px;
        }
        .user-info { flex: 1; font-size: 0.85rem; }
        .user-name { font-weight: 600; }
        .user-roles { color: #666; font-size: 0.75rem; }
        .status { font-size: 0.8rem; color: #666; flex: 1; }
    `;

    constructor() {
        super();
        this._authenticated = false;
        this._username = '';
        this._roles = [];
        this._ready = false;
        this._keycloak = null;
        this._init();
    }

    async _init() {
        try {
            const config = await fetch('/api/auth-config').then(r => r.json());
            this._keycloak = new Keycloak({
                url: config.url,
                realm: config.realm,
                clientId: config.clientId,
            });
            await this._keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false });
            this._updateState();
            this._wireClients();
            this._ready = true;
        } catch (e) {
            console.error('Auth init failed:', e);
            this._ready = true;
        }
    }

    _updateState() {
        this._authenticated = this._keycloak.authenticated || false;
        if (this._authenticated) {
            const token = this._keycloak.tokenParsed;
            this._username = token.preferred_username || token.sub;
            this._roles = token.realm_access?.roles?.filter(r => !r.startsWith('default-')) || [];
        } else {
            this._username = '';
            this._roles = [];
        }
    }

    _wireClients() {
        const kc = this._keycloak;
        const provider = async () => {
            if (kc.authenticated) {
                await kc.updateToken(30);
                return 'Bearer ' + kc.token;
            }
            return null;
        };
        RestClient.configure({ tokenProvider: provider });
        GraphQLClient.configure({ tokenProvider: provider });
        JsonRPCClient.configure({ tokenProvider: provider });
    }

    async _login() {
        await this._keycloak.login();
    }

    async _logout() {
        await this._keycloak.logout({ redirectUri: window.location.origin + '/' });
    }

    render() {
        if (!this._ready) {
            return html`<div class="auth-bar"><span class="status">Connecting to Keycloak...</span></div>`;
        }

        return html`
            <div class="auth-bar">
                ${this._authenticated ? html`
                    <div class="user-info">
                        <span class="user-name">${this._username}</span>
                        <span class="user-roles">[${this._roles.join(', ')}]</span>
                    </div>
                    <vaadin-button theme="tertiary" @click=${() => this._logout()}>Logout</vaadin-button>
                ` : html`
                    <span class="status">Not authenticated — secured endpoints will return 401</span>
                    <vaadin-button theme="primary" @click=${() => this._login()}>Login with Keycloak</vaadin-button>
                `}
            </div>
            <slot></slot>
        `;
    }
}

customElements.define('auth-manager', AuthManager);
