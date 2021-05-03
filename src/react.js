import Component from './Component';
function createElement(type,config,...children) {
    let props={...config}
    if(children.length>1){
        props.children=children
    }else{
        props.children=children[0]
    }
    return {
        type,
        props,
    }
}
const React={
    createElement,Component
}


export default React
