// import React from 'react';
// import ReactDOM from 'react-dom';

import { updateQueue } from './Component';
import React from './react';
import ReactDOM from './react-dom';



// let jsx1=<h1 className="title" style={{ color: 'red' }}><div>Hello</div> world</h1>;



// let ele1 = React.createElement('div', { id: 'box',style:{ color: 'red' } }, React.createElement('span', {}, 'hello'),React.createElement('span', {}, 'world'))
// let ele1 = React.createElement('div', { id: 'box',style:{ color: 'red' } },  'world')
// let ele1 = React.createElement('div', { id: 'box',style:{ color: 'red' } }, 'hello', 'world')
// let ele1 = React.createElement('div', { id: 'box',style:{ color: 'red' } }, React.createElement('span', {}, 'hello'), 'world')
// console.log(ele1);

// function FunctionComponent(props) {
//   return <div className="title" style={{ color: 'skyblue', backgroundColor: 'tomato' }}>
//     <span>Hello</span>
//     {props.children}
//   </div>
// }
// let ele2 = <FunctionComponent name="ldy"><span>World</span></FunctionComponent>
// console.log(JSON.stringify(ele2,null,2));
// console.log(ele2);
// ReactDOM.render(ele2, document.getElementById('root'));




class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name, number: 0 };
  }
  handleClick = (e) => {
    console.log(e);
    // e.stop();
    // console.log(666);
    this.setState(lastState => ({ number: lastState.number + 1 }), () => {
      console.log('cb1', this.state.number);
    });
    console.log(this.state.number);
    this.setState(lastState => ({ number: lastState.number + 1 }), () => {
      console.log('cb2', this.state.number);
    });
    console.log(this.state.number);
    setTimeout(() => {
      console.log(this.state.number);
      this.setState(lastState => ({ number: lastState.number + 1 }), () => {
        console.log('cb3', this.state.number);
      });
      console.log(this.state.number);
      this.setState(lastState => ({ number: lastState.number + 1 }), () => {
        console.log('cb4', this.state.number);
      });
      console.log(this.state.number);
    });
  }
  render() {
    return (
      <div onClick={()=>alert(666)}>
        <p>number:{this.state.number}</p>
        <button onClick={this.handleClick}>
          <span>+</span>
        </button>
      </div>
    )
  }
}
let ele = <Counter title="计数器" />
console.log(ele);
ReactDOM.render(ele, document.getElementById('root'));

