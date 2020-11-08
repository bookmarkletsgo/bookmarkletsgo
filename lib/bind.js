// const c = Function.call;
// const bind = c.bind.bind(c);
// var c=Function.call,bind=c.bind.bind(c);
const f = Function;
const bind = f.bind.bind(f.call);
// var f=Function,bind=f.bind.bind(f.call);
export default bind;
