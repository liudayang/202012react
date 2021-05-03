import { isText } from './utils'
import { addEvent } from './event'
function render(vdom, container) {
    const dom = createDOM(vdom);
    container.appendChild(dom)
    dom.componentDidMount&&dom.componentDidMount()
}

function createDOM(vdom) {
    // console.log('vdom', vdom);

    if (isText(vdom)) {
        return document.createTextNode(vdom);
    }
    let { type, props } = vdom;
    let dom
    if (typeof type === 'function') {
        if (type.isReactComponent) {//说明这个type是一个类组件的虚拟DOM元素
            return mountClassComponent(vdom);
          } else {
            return mountFunctionComponent(vdom);
        }
    } else {
        dom = document.createElement(type);
    }

    updateProps(dom, {}, props);//更新属性
    if (typeof props.children === 'object' && props.children.type) {
        render(props.children, dom);
    } else if (isText(props.children)) {
        dom.textContent = props.children
    } else if (Array.isArray(props.children)) {
        reconcileChildren(props.children, dom);
    }
    vdom.dom = dom
    // console.log(vdom);
    return dom
}
function reconcileChildren(vdoms = [], parent) {
    vdoms.forEach(vdom => render(vdom, parent));
}
function mountClassComponent(vdom){
    const {type, props} = vdom;
    const classInstance = new type(props);
    if(classInstance.componentWillMount){
        classInstance.componentWillMount()
    }
    vdom.classInstance=classInstance;
    const renderVdom = classInstance.render();
    classInstance.oldRenderVdom=vdom.oldRenderVdom=renderVdom;
    const dom = createDOM(renderVdom);
    if(classInstance.componentDidMount){
        dom.componentDidMount=classInstance.componentDidMount.bind(classInstance)
    }
    classInstance.dom=dom
    return dom;
}

function mountFunctionComponent(vdom) {
    const {type, props} = vdom;
    const renderVdom = type(props);
    vdom.oldRenderVdom=renderVdom;
    console.log(vdom);
    return createDOM(renderVdom);
}
function updateProps(dom, oldProps = {}, newProps = {}) {
    for (let key in newProps) {
        if (key === 'children') { continue; }
        if (key === 'style') {
            let style = newProps[key];
            for (let attr in style) {
                dom.style[attr] = style[attr]
            }
        } else if(key.startsWith('on')) {
            // dom[key.toLocaleLowerCase()] = newProps[key];
            addEvent(dom,key.toLocaleLowerCase(),newProps[key])
        }else{
            dom[key] = newProps[key];
        }
    }
    if (oldProps) {
        for (let key in oldProps) {
            if (!newProps.hasOwnProperty(key)) {
                dom[key] = '';
            }
        }
    }
}
const ReactDOM = {
    render
}

export {createDOM};
export default ReactDOM
