import bind from './bind';
import { ElementPrototype } from './property-names';

export const getAttribute = bind(ElementPrototype.getAttribute);
