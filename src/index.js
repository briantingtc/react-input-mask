import React from 'react';
import ReactDOM from 'react-dom';
import { InputMask } from './input_mask.js'
import BuiltMask from 'react-input-mask'

const App = () => (
  <div style={{
    display:'flex',
    flexDirection:'row',
    padding:'5px',
    justifyContent:'center',
    alignItems:'center'
  }}>
    <div style={{
      margin:'25px'
    }}>
      <h1>
        TestMask
      </h1>
      <InputMask mask={'(999) 999-9999?  x99999'}/>
    </div>
    <div style={{
      margin:'25px'
    }}>
      <h1>
        BuiltMask
      </h1>
      <BuiltMask mask={'(999) 999-9999? x99999'} />
    </div>
  </div>
)
ReactDOM.render(<App/>, document.getElementById('root'));
