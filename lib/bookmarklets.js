import { find } from './array-find';
import { APP_NAME } from './constants';
const localStorage = window.localStorage;

const LOCAL_STORAGE_KEY = APP_NAME + '_bookmarklets';

function save(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

function get() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

export const addAll = (items) => {
  // TODO: check version, use latest data.
  // const list = get();
  // items.forEach((item) => list.push(item));
  const list = items;
  save(list);
};

export const getById = (id) => {
  return find(get(), (x) => x._id === id);
};

export const getAll = () => {
  return get();
};
