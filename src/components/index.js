import filterPanel from './filterPanel'
import picList from './picList'
import uploadBtn from './uploadBtn'

const components = {
  // contentWrap,
  filterPanel,
  picList,
  uploadBtn
};

const install = function(Vue) {
    for(let i in components) {
        Vue.component(i, components[i]);
    };
};
if(typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
};
components.install = install;
export default components;
