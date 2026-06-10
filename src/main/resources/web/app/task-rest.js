import {LitElement, html, css} from 'lit';
import '@vaadin/text-field';
import '@vaadin/button';
import '@vaadin/checkbox';
import '@vaadin/icon';
import '@vaadin/icons';
import {TaskResource} from '@quarkus/rest-api';

class TaskRest extends LitElement {

    static properties = { _tasks: {state: true} };
    static styles = css`:host { display: block; }`;

    constructor() { super(); this._tasks = []; this._load(); }

    async _load() {
        try { this._tasks = await TaskResource.getApiTasks(); } catch (e) { console.error('REST:', e); }
    }

    async _add() {
        const field = this.renderRoot.querySelector('vaadin-text-field');
        if (!field.value.trim()) return;
        await TaskResource.postApiTasks({body: {title: field.value.trim()}});
        field.value = '';
        this._load();
    }

    async _toggle(id) { await TaskResource.putApiTasksIdToggle({id}); this._load(); }
    async _delete(id) { await TaskResource.deleteApiTasksId({id}); this._load(); }

    render() {
        return html`
            <div style="display:flex;gap:8px;margin-bottom:12px">
                <vaadin-text-field placeholder="New task..." style="flex:1"
                    @keydown=${e => e.key === 'Enter' && this._add()}></vaadin-text-field>
                <vaadin-button theme="primary" @click=${() => this._add()}>Add</vaadin-button>
            </div>
            ${this._tasks.map(t => html`
                <div style="display:flex;align-items:center;padding:4px 0;border-bottom:1px solid #eee">
                    <vaadin-checkbox ?checked=${t.completed}
                        @change=${() => this._toggle(t.id)}></vaadin-checkbox>
                    <span style="flex:1;${t.completed ? 'text-decoration:line-through;color:#999' : ''}">${t.title}</span>
                    <vaadin-button theme="icon tertiary error" @click=${() => this._delete(t.id)}>
                        <vaadin-icon icon="vaadin:close-small"></vaadin-icon>
                    </vaadin-button>
                </div>
            `)}
        `;
    }
}

customElements.define('task-rest', TaskRest);
