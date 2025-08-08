import React from "react";
import AceEditor from "react-ace";

import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/mode-text';
import 'ace-builds/src-min-noconflict/mode-json';
import 'ace-builds/src-min-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import './theme-contrast.js';
import './mode-mcfunction.js';

export class Ace extends React.Component<any> {
    componentDidMount() {
        // FIXME: I have no choice here but to use the refs
        const editor = (this.refs.aceEditor as any).editor;
        window["ace_"+this.props.name] = editor;
        if (this.props.value) editor.setValue(this.props.value, -1);
        if (this.props.readonly) editor.setReadOnly(true);

        const div = document.getElementById(this.props.name)!;
        div.style.height = this.props.height ?? "500px";
        div.style.width = this.props.width ?? "500px";

        if (this.props.save) {
            div.addEventListener("focusout", () => this.props.save(editor.getValue()));
            div.addEventListener("keydown", (e) => {
                if (e.key == "Enter") return this.props.save(editor.getValue());
            });
        }
        if (this.props.hidden) div.toggleAttribute("hidden");
    }

    render() {
        return (
            // If there's an error here, that error is invalid. You can ignore this.
            <AceEditor
                ref="aceEditor"
                mode={this.props.mode}
                theme="contrast"
                name={this.props.name}
            />
        );
    }
}