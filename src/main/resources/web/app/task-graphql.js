import {LitElement, html, css} from 'lit';
import {Queries, Mutations} from '@quarkus/graphql-api';

class TaskGraphql extends LitElement {

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
        .btn-add { background: #1565c0; color: white; }
        .btn-add:hover { background: #0d47a1; }
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
        try {
            const data = await Queries.tasks();
            this._tasks = data.tasks || data;
        } catch (e) { console.error('GraphQL:', e); }
    }

    async _add(e) {
        const input = e.target.closest('.add-form').querySelector('input');
        if (!input.value.trim()) return;
        await Mutations.addTask({title: input.value.trim()});
        input.value = '';
        this._load();
    }

    async _toggle(id) { await Mutations.toggleTask({id}); this._load(); }
    async _delete(id) { await Mutations.deleteTask({id}); this._load(); }

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

customElements.define('task-graphql', TaskGraphql);
