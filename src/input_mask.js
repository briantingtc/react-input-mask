import React from 'react';
import ReactDOM from 'react-dom';
import { setCaret } from './helpers.js'
import { createInputMaskController } from './class.js'

export class InputMask extends React.Component {
  constructor(props, context){
    super(props, context)

    this.state = { value: props.value }
  }

  componentDidMount(){
    this.input_mask_controller = createInputMaskController(this.props)(this.inputEl)
  }

  setInputElement(el){ this.inputEl = el }

  onKeyPress(e){
    const result = this.input_mask_controller.parseKeyPressEvent(e.nativeEvent)

    if (result) {
      this.setState({value: result.value}, result.callback)
    }
  }

  onKeyDown(e){
    const result = this.input_mask_controller.parseKeyDownEvent(e.nativeEvent)

    if (result) {
      this.setState({value: result.value}, result.callback)
    }
  }

  onBlur(e){
    const result = this.input_mask_controller.checkVal()
    if (result) {
      this.setState({value: result.value})
    }
  }

  render(){
    return React.createElement('input', {
      ref: this.setInputElement.bind(this),
      value: this.state.value,
      // onChange(e){console.log('onchange')},
      // onFocus: this.onFocus.bind(this),
      onBlur: this.onBlur.bind(this),
      onKeyPress: this.onKeyPress.bind(this),
      onKeyDown: this.onKeyDown.bind(this),
    })
  }
}

InputMask.defaultProps = {
  definitions: {
      '9': "[0-9]",
      'a': "[A-Za-z]",
      '*': "[A-Za-z0-9]"
  },
  placeholder: '_',
  value: '',
}
