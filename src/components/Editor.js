import "quill/dist/quill.snow.css";
import React from "react";
import ReactQuill from "react-quill";

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.quillRef = null; // Quill instance
        this.reactQuillRef = null; // ReactQuill component
        this.handleChange = this.props.handleChange
    }

    componentDidMount() {
        this.attachQuillRefs();
    }

    componentDidUpdate() {
        this.attachQuillRefs();
    }

    attachQuillRefs = () => {
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        this.quillRef = this.reactQuillRef.getEditor();
    };

    insertText = (text) => {
        var range = this.quillRef.getSelection();
        let position = range ? range.index : 0;
        this.quillRef.insertText(position, `{${text}}`);
    };

    render() {
        return (
            <ReactQuill
                className="h-full"
                ref={(el) => {
                    this.reactQuillRef = el;
                }}
                theme={'snow'}
                onChange={this.handleChange}
            />
        );
    }
}

export default Editor