import * as window from 'window';
import * as p from './polyfill/exports';
p.apply(window, [p.Element.append]);
import bind from './bind';
import { ElementPrototype } from './property-names';

export const append = bind(ElementPrototype.append);
