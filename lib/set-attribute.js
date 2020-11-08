import bind from './bind';
import { ElementPrototype } from './property-names';

export const setAttribute = bind(ElementPrototype.setAttribute);
