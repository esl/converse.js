import tplSpinner from "templates/spinner.js";
import { _converse, api, converse } from "@converse/headless/core.js";
import { html } from 'lit';

const { Strophe } = converse.env;


function whenNotConnected (o) {
    const connection_status = _converse.connfeedback.get('connection_status');
    if ([Strophe.Status.RECONNECTING, Strophe.Status.CONNECTING].includes(connection_status)) {
        return tplSpinner();
    }
    if (o['active-form'] === 'register') {
        return html`
            <div class="controlbox-panes">
                <div class="controlbox-pane">
                    <converse-register-panel></converse-register-panel>
                </div>
            </div>`;
    }
    return html`
        <div class="controlbox-panes">
            <div class="controlbox-pane">
                <converse-login-form id="converse-login-panel" class="controlbox-pane fade-in row no-gutters"></converse-login-form>
            </div>
        </div>`;
}


export default (el) => {
    const o = el.model.toJSON();
    const sticky_controlbox = api.settings.get('sticky_controlbox');

    return html`
        <div class="flyout box-flyout">
            <converse-dragresize></converse-dragresize>
            <div class="chat-head controlbox-head">
                ${sticky_controlbox
                    ? ''
                    : html`
                        <a class="chatbox-btn close-chatbox-button" @click=${(ev) => el.close(ev)}>
                            <converse-icon class="fa fa-times" size="1em"></converse-icon>
                        </a>
                    `}
            </div>
            ${o.connected
                ? html`
                    <div class="controlbox-panes visible-border-right">
                        <div class="controlbox-pane">
                            <converse-user-profile></converse-user-profile>
                            <converse-headlines-feeds-list class="controlbox-section"></converse-headlines-feeds-list>
                            <div id="chatrooms" class="controlbox-section"><converse-rooms-list></converse-rooms-list></div>
                            ${ api.settings.get("authentication") === _converse.ANONYMOUS ? '</div></div>' :
                                html`<div id="converse-roster" class="controlbox-section"><converse-roster></converse-roster></div>
                                </div></div>`
                            }`
                : whenNotConnected(o)
            }
        </div>`
};
