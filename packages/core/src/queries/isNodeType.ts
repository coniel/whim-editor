import { Node, NodeEntry, Element } from 'slate';
import { QueryOptions } from '../types/QueryOptions.types';

/**
 * Is the node entry filling a condition.
 */
export const isNodeType = (
  entry?: NodeEntry<Node>,
  { filter = (): boolean => true, allow = [], exclude = [] }: QueryOptions = {},
): boolean => {
  let filterAllow: typeof filter = () => true;
  if (allow.length) {
    filterAllow = ([n]): boolean =>
      Element.isElement(n) && allow.includes(n.type as string);
  }

  let filterExclude: typeof filter = () => true;
  if (exclude.length) {
    filterExclude = ([n]): boolean =>
      !Element.isElement(n) || !exclude.includes(n.type as string);
  }

  return !!entry && filter(entry) && filterAllow(entry) && filterExclude(entry);
};
