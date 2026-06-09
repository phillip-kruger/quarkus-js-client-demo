import {LitElement, html, css} from 'lit';
import {TaskResource} from '@quarkus/rest-api';

class TaskRest extends LitElement {

    static properties = {
        _tasks: {state: true},
    };

    static styles = css`
        :host { display: block; }
        .add-form { display: flex; gap: 6px; margin-bottom: 12px; }
        .add-form input {
            flex: 1; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.85rem;
        }
        button { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 500; }
        .btn-add { background: #2e7d32; color: white; }
        .btn-add:hover { background: #1b5e20; }
        .task-list { list-style: none; padding: 0; margin: 0; }
        .task-item {
            display: flex; align-items: center; justify-content: space-between;
            padding: 8px; border-bottom: 1px solid #f0f0f0; font-size: 0.85rem;
        }
        .task-item.completed .task-title { text-decoration: line-through; color: #999; }
        .task-title { flex: 1; cursor: pointer; }
        .btn-delete { padding: 2px 8px; font-size: 0.7rem; background: #ffebee; color: #c62828; }
    `;

    constructor() {
        super();
        this._tasks = [];
        this._load();
    }

    async _load() {
        try { this._tasks = await TaskResource.getApiTasks(); } catch (e) { console.error('REST:', e); }
    }

    async _add(e) {
        const input = e.target.closest('.add-form').querySelector('input');
        if (!input.value.trim()) return;
        await TaskResource.postApiTasks({title: input.value.trim()});
        input.value = '';
        this._load();
    }

    async _toggle(id) { await TaskResource.putApiTasksIdToggle({}, {id}); this._load(); }
    async _delete(id) { await TaskResource.deleteApiTasksId({id}); this._load(); }

    render() {
        return html`
            <div class="add-form">
                <input placeholder="New task..." @keyup=${e => e.key === 'Enter' && this._add(e)}>
                <button class="btn-add" @click=${e => this._add(e)}>Add</button>
            </div>
            <ul class="task-list">
                ${this._tasks.map(t => html`
                    <li class="task-item ${t.completed ? 'completed' : ''}">
                        <span class="task-title" @click=${() => this._toggle(t.id)}>${t.title}</span>
                        <button class="btn-delete" @click=${() => this._delete(t.id)}>x</button>
                    </li>
                `)}
            </ul>
        `;
    }
}

customElements.define('task-rest', TaskRest);
