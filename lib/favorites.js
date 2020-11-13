import { find } from './array-find';
import { APP_NAME } from './constants';
import { localStorage } from './storage';

const LOCAL_STORAGE_KEY = APP_NAME + '_favorites';

function save(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
}

function get() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

export const add = (item) => {
  const list = get();
  list.push(item);
  save(list);
};

/**
 * item: object or id
 */
export const remove = (item) => {
  const key = item._id || item;
  save(get().filter((x) => x._id !== key));
};

export const getById = (id) => {
  return find(get(), (x) => x._id === id);
};

export const getAll = () => {
  return get();
};

export const getIds = () => {
  return get().map((x) => x._id);
};
