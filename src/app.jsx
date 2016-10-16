import React from 'react';
import ReactDOM from 'react-dom';
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import {Editor, EditorState, RichUtils} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
  }
  componentDidMount(){
    this.refs.editor.focus();
  }
  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }
  render() {
    const {editorState} = this.state;
    return <div>
    <h1>Draft.js Test</h1>
    <div class="rows">
      <button onMouseDown={(e) => {
        this.onChange(
          RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
        )
        e.preventDefault()
      }}>Bold</button>
      <button onMouseDown={(e) => {
        this.onChange(
          RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
        )
        e.preventDefault()
      }}>Italic</button>
      <button onMouseDown={(e) => {
        this.onChange(
          RichUtils.toggleBlockType(this.state.editorState, 'header-two')
        )
        e.preventDefault()
      }}>H2</button>
      <button onMouseDown={(e) => {
        this.onChange(
          RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item')
        )
        e.preventDefault()
      }}>List</button>
    </div>
    <div id='cowEditer'>
    <Editor
      editorState={editorState}
      onChange={this.onChange}
      handleKeyCommand={this.handleKeyCommand.bind(this)}
      ref="editor"
      />
    </div></div>;
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
);
