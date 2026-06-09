import {LitElement, html, css} from 'lit';
import '@vaadin/text-field';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import {client, SecuredTaskJsonRpc} from '@quarkiverse/json-rpc-api';

class TaskJsonrpcSecured extends LitElement {

    static properties = {
        _tasks: {state: true},
        _error: {state: true},
        _connected: {state: true},
    };

    static styles = css`
        :host { display: block; }
        .error { color: #c62828; font-size: 0.75rem; padding: 6px; background: #ffebee; border-radius: 4px; margin-bottom: 8px; }
        .status { font-size: 0.75rem; margin-bottom: 8px; }
        .status.connected { color: #2e7d32; }
        .status.disconnected { color: #c62828; }
    `;

    constructor() {
        super();
        this._tasks = [];
        this._error = null;
        this._connected = client.connected;
        client.onOpen = () => { this._connected = true; this._load(); };
        client.onClose = () => { this._connected = false; };
        if (client.connected) this._load();
    }

    async _load() {
        this._error = null;
        try { this._tasks = await SecuredTaskJsonRpc.securedTasks(); }
        catch (e) { this._error = e.message || 'Unauthorized'; this._tasks = []; }
    }

    async _add() {
        const field = this.renderRoot.querySelector('vaadin-text-field');
        if (!field.value.trim()) return;
        try { await SecuredTaskJsonRpc.securedAddTask({title: field.value.trim()}); field.value = ''; }
        catch (e) { this._error = e.message || 'Unauthorized'; }
        this._load();
    }

    async _delete(id) {
        try { await SecuredTaskJsonRpc.securedDeleteTask({id}); }
        catch (e) { this._error = e.message || 'Forbidden (admin only)'; }
        this._load();
    }

    render() {
        return html`
            <div class="status ${this._connected ? 'connected' : 'disconnected'}">
                WebSocket: ${this._connected ? 'Connected' : 'Connecting...'}
            </div>
            ${this._error ? html`<div class="error">${this._error}</div>` : ''}
            <div style="display:flex;gap:8px;margin-bottom:12px">
                <vaadin-text-field placeholder="New task..." style="flex:1" ?disabled=${!this._connected}
                    @keydown=${e => e.key === 'Enter' && this._add()}></vaadin-text-field>
                <vaadin-button theme="primary" ?disabled=${!this._connected}
                    @click=${() => this._add()}>Add</vaadin-button>
            </div>
            ${this._tasks.map(t => html`
                <div style="display:flex;align-items:center;padding:4px 0;border-bottom:1px solid #eee">
                    <span style="flex:1">${t.title}</span>
                    <vaadin-button theme="icon tertiary error" @click=${() => this._delete(t.id)}>
                        <vaadin-icon icon="vaadin:close-small"></vaadin-icon>
                    </vaadin-button>
                </div>
            `)}
        `;
    }
}

customElements.define('task-jsonrpc-secured', TaskJsonrpcSecured);
