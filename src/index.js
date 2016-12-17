import React from 'react';
import ReactDOM from 'react-dom';
import { buildTestsFromMask, maskInput } from './helpers.js'

export class InputMask extends React.Component {
  constructor(props, context){
    super(props, context)

    this.onChange = this.onChange.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)

    this.tests = buildTestsFromMask(props.mask, props.definitions)

    this.state = {
      rawInput: '',
      maskedInput: '',
      value: maskInput(props.value, props.mask, this.tests)
    }

  }

  onChange(e){
    const maskedInput = maskInput(e.target.value, this.props.mask, this.tests)
    this.setState({
      rawInput: e.target.value,
      maskedInput,
    })
  }

  onFocus(e){

  }

  onBlur(e){

  }

  render(){
    // partialPosition = len = this.props.mask.length;
    return React.createElement('input', {
      value: this.state.rawInput,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
    })
  }
}

InputMask.defaultProps = {
  definitions: {
      '9': "[0-9]",
      'a': "[A-Za-z]",
      '*': "[A-Za-z0-9]"
  },
  dataName: "rawMaskFn",
  placeholder: '_',
  value: '',
}

ReactDOM.render(<InputMask mask={'(999) 999-9999? x99999'}/>, document.getElementById('root'));
