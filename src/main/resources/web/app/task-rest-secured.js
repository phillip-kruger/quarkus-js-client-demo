import {LitElement, html, css} from 'lit';
import '@vaadin/text-field';
import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/icon';
import '@vaadin/icons';
import {SecuredTaskResource} from '@quarkus/rest-api';

class TaskRestSecured extends LitElement {

    static properties = {
        _tasks: {state: true},
        _error: {state: true},
    };

    static styles = css`
        :host { display: block; }
        .error { color: #c62828; font-size: 0.75rem; padding: 6px; background: #ffebee; border-radius: 4px; margin-bottom: 8px; }
    `;

    constructor() { super(); this._tasks = []; this._error = null; this._load(); }

    async _load() {
        this._error = null;
        try { this._tasks = await SecuredTaskResource.getApiSecuredTasks(); }
        catch (e) { this._error = e.message || 'Unauthorized'; this._tasks = []; }
    }

    async _add() {
        const field = this.renderRoot.querySelector('vaadin-text-field');
        if (!field.value.trim()) return;
        try { await SecuredTaskResource.postApiSecuredTasks({body: {title: field.value.trim()}}); field.value = ''; }
        catch (e) { this._error = e.message || 'Unauthorized'; }
        this._load();
    }

    async _delete(id) {
        try { await SecuredTaskResource.deleteApiSecuredTasksId({id}); }
        catch (e) { this._error = e.message || 'Forbidden (admin only)'; }
        this._load();
    }

    render() {
        return html`
            ${this._error ? html`<div class="error">${this._error}</div>` : ''}
            <div style="display:flex;gap:8px;margin-bottom:12px">
                <vaadin-text-field placeholder="New task..." style="flex:1"
                    @keydown=${e => e.key === 'Enter' && this._add()}></vaadin-text-field>
                <vaadin-button theme="primary" @click=${() => this._add()}>Add</vaadin-button>
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

customElements.define('task-rest-secured', TaskRestSecured);
