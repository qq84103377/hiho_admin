
import contentWrap from './content-wrap'
import brandPop from './brand-pop'
import createCodePop from './create-code-pop'

const Components = {
  contentWrap,
  brandPop,
  createCodePop
};

const install = function(Vue) {
    for(let i in Components) {
        Vue.component(i, Components[i]);
    };
};
if(typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
};
Components.install = install;
export default Components;
