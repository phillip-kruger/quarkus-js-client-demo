import {LitElement, html, css} from 'lit';
import './task-rest.js';
import './task-graphql.js';
import './task-jsonrpc.js';
import './auth-manager.js';
import './task-rest-secured.js';
import './task-graphql-secured.js';
import './task-jsonrpc-secured.js';

class TaskDemo extends LitElement {

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
        h2.section { font-size: 1.2rem; margin: 32px 0 8px 0; color: #333; }
        .subtitle { color: #666; margin: 0 0 24px 0; font-size: 0.9rem; }
        .panels { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .panel {
            background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px;
        }
        .panel.secured { border-color: #ff9800; }
        .panel h3 {
            font-size: 1rem; margin: 0 0 4px 0; display: flex; align-items: center; gap: 8px;
        }
        .badge {
            font-size: 0.65rem; padding: 2px 8px; border-radius: 10px;
            font-weight: 600; text-transform: uppercase;
        }
        .badge.rest { background: #e8f5e9; color: #2e7d32; }
        .badge.graphql { background: #e3f2fd; color: #1565c0; }
        .badge.rpc { background: #f3e5f5; color: #7b1fa2; }
        .badge.secured { background: #fff3e0; color: #e65100; }
        .protocol { color: #999; font-size: 0.75rem; margin: 0 0 12px 0; font-family: monospace; }
    `;

    render() {
        return html`
            <h1>Quarkus JS Client Demo</h1>
            <p class="subtitle">Same task data, three protocols, three generated JS clients</p>

            <div class="panels">
                <div class="panel">
                    <h3>REST <span class="badge rest">fetch</span></h3>
                    <p class="protocol">import { TaskResource } from '@quarkus/rest-api'</p>
                    <task-rest></task-rest>
                </div>
                <div class="panel">
                    <h3>GraphQL <span class="badge graphql">query</span></h3>
                    <p class="protocol">import { Queries, Mutations } from '@quarkus/graphql-api'</p>
                    <task-graphql></task-graphql>
                </div>
                <div class="panel">
                    <h3>JSON-RPC <span class="badge rpc">websocket</span></h3>
                    <p class="protocol">import { TaskJsonRpc } from '@quarkiverse/json-rpc-api'</p>
                    <task-jsonrpc></task-jsonrpc>
                </div>
            </div>

            <h2 class="section">Secured Endpoints <span class="badge secured">keycloak</span></h2>
            <auth-manager>
                <div class="panels">
                    <div class="panel secured">
                        <h3>REST <span class="badge rest">@RolesAllowed</span></h3>
                        <p class="protocol">RestClient.configure({ tokenProvider: ... })</p>
                        <task-rest-secured></task-rest-secured>
                    </div>
                    <div class="panel secured">
                        <h3>GraphQL <span class="badge graphql">@RolesAllowed</span></h3>
                        <p class="protocol">GraphQLClient.configure({ tokenProvider: ... })</p>
                        <task-graphql-secured></task-graphql-secured>
                    </div>
                    <div class="panel secured">
                        <h3>JSON-RPC <span class="badge rpc">@RolesAllowed</span></h3>
                        <p class="protocol">JsonRPCClient.configure({ tokenProvider: ... })</p>
                        <task-jsonrpc-secured></task-jsonrpc-secured>
                    </div>
                </div>
            </auth-manager>
        `;
    }
}

customElements.define('task-demo', TaskDemo);
