import {LitElement, html, css} from 'lit';
import {TaskResource} from '@quarkus/rest-api';
import {Queries, Mutations} from '@quarkus/graphql-api';
import {client as rpcClient, TaskJsonRpc} from '@quarkiverse/json-rpc-api';

class TaskDemo extends LitElement {

    static properties = {
        _restTasks: {state: true},
        _graphqlTasks: {state: true},
        _rpcTasks: {state: true},
    };

    static styles = css`
        :host {
            display: block;
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            color: #1a1a2e;
        }
        h1 { font-size: 1.6rem; margin: 0 0 8px 0; color: #0d47a1; }
        .subtitle { color: #666; margin: 0 0 24px 0; font-size: 0.9rem; }
        .panels { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .panel {
            background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;
        }
        .panel h2 {
            font-size: 1rem; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;
        }
        .badge {
            font-size: 0.65rem; padding: 2px 8px; border-radius: 10px;
            font-weight: 600; text-transform: uppercase;
        }
        .badge.rest { background: #e8f5e9; color: #2e7d32; }
        .badge.graphql { background: #e3f2fd; color: #1565c0; }
        .badge.rpc { background: #f3e5f5; color: #7b1fa2; }
        .protocol { color: #999; font-size: 0.75rem; margin: 0 0 12px 0; }
        .add-form { display: flex; gap: 6px; margin-bottom: 12px; }
        .add-form input {
            flex: 1; padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px;
            font-size: 0.85rem;
        }
        .add-form button, .task-actions button {
            padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;
            font-size: 0.8rem; font-weight: 500;
        }
        .btn-add { background: #1565c0; color: white; }
        .btn-add:hover { background: #0d47a1; }
        .task-list { list-style: none; padding: 0; margin: 0; }
        .task-item {
            display: flex; align-items: center; justify-content: space-between;
            padding: 8px; border-bottom: 1px solid #f0f0f0; font-size: 0.85rem;
        }
        .task-item.completed .task-title { text-decoration: line-through; color: #999; }
        .task-title { flex: 1; cursor: pointer; }
        .task-actions button {
            padding: 2px 8px; font-size: 0.7rem; background: #ffebee; color: #c62828;
            margin-left: 4px;
        }
        .error { color: #c62828; font-size: 0.8rem; padding: 8px; background: #ffebee; border-radius: 4px; }
    `;

    constructor() {
        super();
        this._restTasks = [];
        this._graphqlTasks = [];
        this._rpcTasks = [];
        this._loadRest();
        this._loadGraphql();
        rpcClient.onOpen = () => this._loadRpc();
        if (rpcClient.connected) this._loadRpc();
    }

    async _loadRest() {
        try { this._restTasks = await TaskResource.getApiTasks(); } catch (e) { console.error('REST:', e); }
    }

    async _loadGraphql() {
        try {
            const data = await Queries.tasks();
            this._graphqlTasks = data.tasks || data;
        } catch (e) { console.error('GraphQL:', e); }
    }

    async _loadRpc() {
        try { this._rpcTasks = await TaskJsonRpc.tasks(); } catch (e) { console.error('JSON-RPC:', e); }
    }

    async _addRest(e) {
        const input = e.target.closest('.add-form').querySelector('input');
        if (!input.value.trim()) return;
        await TaskResource.postApiTasks({title: input.value.trim()});
        input.value = '';
        this._loadRest();
    }

    async _addGraphql(e) {
        const input = e.target.closest('.add-form').querySelector('input');
        if (!input.value.trim()) return;
        await Mutations.addTask({title: input.value.trim()});
        input.value = '';
        this._loadGraphql();
    }

    async _addRpc(e) {
        const input = e.target.closest('.add-form').querySelector('input');
        if (!input.value.trim()) return;
        await TaskJsonRpc.addTask({title: input.value.trim()});
        input.value = '';
        this._loadRpc();
    }

    async _toggleRest(id) { await TaskResource.putApiTasksIdToggle({}, {id}); this._loadRest(); }
    async _toggleGraphql(id) { await Mutations.toggleTask({id}); this._loadGraphql(); }
    async _toggleRpc(id) { await TaskJsonRpc.toggleTask({id}); this._loadRpc(); }

    async _deleteRest(id) { await TaskResource.deleteApiTasksId({id}); this._loadRest(); }
    async _deleteGraphql(id) { await Mutations.deleteTask({id}); this._loadGraphql(); }
    async _deleteRpc(id) { await TaskJsonRpc.deleteTask({id}); this._loadRpc(); }

    _renderPanel(title, badge, badgeClass, protocol, tasks, onAdd, onToggle, onDelete) {
        return html`
            <div class="panel">
                <h2>${title} <span class="badge ${badgeClass}">${badge}</span></h2>
                <p class="protocol">${protocol}</p>
                <div class="add-form">
                    <input placeholder="New task..." @keyup=${e => e.key === 'Enter' && onAdd(e)}>
                    <button class="btn-add" @click=${onAdd}>Add</button>
                </div>
                <ul class="task-list">
                    ${(tasks || []).map(t => html`
                        <li class="task-item ${t.completed ? 'completed' : ''}">
                            <span class="task-title" @click=${() => onToggle(t.id)}>${t.title}</span>
                            <span class="task-actions">
                                <button @click=${() => onDelete(t.id)}>x</button>
                            </span>
                        </li>
                    `)}
                </ul>
            </div>
        `;
    }

    render() {
        return html`
            <h1>Quarkus JS Client Demo</h1>
            <p class="subtitle">Same task data, three protocols, three generated JS clients</p>
            <div class="panels">
                ${this._renderPanel('REST', 'fetch', 'rest',
                    'import { TaskResource } from \'@quarkus/rest-api\'',
                    this._restTasks,
                    e => this._addRest(e), id => this._toggleRest(id), id => this._deleteRest(id))}
                ${this._renderPanel('GraphQL', 'query', 'graphql',
                    'import { Queries, Mutations } from \'@quarkus/graphql-api\'',
                    this._graphqlTasks,
                    e => this._addGraphql(e), id => this._toggleGraphql(id), id => this._deleteGraphql(id))}
                ${this._renderPanel('JSON-RPC', 'websocket', 'rpc',
                    'import { TaskJsonRpc } from \'@quarkiverse/json-rpc-api\'',
                    this._rpcTasks,
                    e => this._addRpc(e), id => this._toggleRpc(id), id => this._deleteRpc(id))}
            </div>
        `;
    }
}

customElements.define('task-demo', TaskDemo);
