import { createDOM } from './react-dom';

let updateQueue = {
    isBatchingUpdate: false,
    updaters: new Set(),
    batchUpdate() {
        for (const updater of this.updaters) {
            // console.log(666);
            updater.updateComponent()
        }
        this.isBatchingUpdate = false;
    }
};
class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance;
        this.pendingStates = []
        this.callBacks = []
    }
    addState(partialState, callBack) {
        if (partialState) this.pendingStates.push(partialState);
        if (callBack) this.callBacks.push(callBack);
        this.emitUpdate()
    }
    emitUpdate() {
        if (updateQueue.isBatchingUpdate) {
            updateQueue.updaters.add(this)
        } else {
            this.updateComponent()
        }
    }
    updateComponent() {
        let { classInstance, pendingStates, callBacks } = this
        if (pendingStates.length > 0) {
            // classInstance.state = this.getState()
            // classInstance.forceUpdate()
            // callBacks.forEach(cb => cb())
            // callBacks.length = 0
            this.shouldUpdate(classInstance, this.getState())
        }
    }
    shouldUpdate(classInstance, nextState) {
        classInstance.state = nextState;
        if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(classInstance.props, classInstance.state)) {
            return
        }
        classInstance.forceUpdate()
        // callBacks.forEach(cb => cb())
        // callBacks.length = 0
    }
    getState() {
        let { classInstance, pendingStates, } = this
        let { state } = classInstance;
        pendingStates.forEach(nextState => {
            if (typeof nextState === 'function') {
                nextState = nextState.call(classInstance, state)
            }
            state = { ...state, ...nextState }
        })
        pendingStates.length = 0
        return state
    }


}
class Component {
    static isReactComponent = true
    constructor(props) {
        this.props = props;
        this.updater = new Updater(this)
    }
    setState(partialState, callBack) {
        this.updater.addState(partialState, callBack)
    }
    // setState(partialState) {
    //     let state = this.state;
    //     this.state = { ...state, ...partialState }
    //     let newVdom = this.render()
    //     this.updateClassComponent(this, newVdom);
    // }
    forceUpdate() {
        this.componentWillUpdate&&this.componentWillUpdate()
        let newVdom = this.render()
        this.updateClassComponent(this, newVdom);
        this.componentDidUpdate&&this.componentDidUpdate()

    }
    updateClassComponent(classInstance, newRenderVdom) {
        let oldDom = classInstance.dom;
        let newDom = createDOM(newRenderVdom)
        oldDom.parentNode.replaceChild(newDom, oldDom)
        classInstance.dom = newDom;
    }
}
export { updateQueue }
export default Component;
