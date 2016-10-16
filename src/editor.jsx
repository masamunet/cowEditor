import React from 'react';
import ReactDOM from 'react-dom';
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import {Editor, ç, RichUtils} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();
  }
  componentDidMount(){
    this.focus();
    window.onfocus = ()=>{
      this.focus();
    };
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
    return　<div id='cowEditer'>
    <Editor
      editorState={editorState}
      onChange={this.onChange}
      handleKeyCommand={this.handleKeyCommand.bind(this)}
      ref="editor"
      />
    </div>;
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
);
