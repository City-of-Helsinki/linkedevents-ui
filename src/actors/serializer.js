
let arg = null;

window.ARG = arg;



export default (store) => {
    
    const { editor, routing } = store.getState();
    const dispatch = store.dispatch;
    console.log("updating state array");
    window.ARG = _.cloneDeep(editor);

}
