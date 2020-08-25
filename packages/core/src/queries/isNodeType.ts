import { Node, NodeEntry } from 'slate';
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
    filterAllow = ([n]): boolean => allow.includes(n.type as string);
  }

  let filterExclude: typeof filter = () => true;
  if (exclude.length) {
    filterExclude = ([n]): boolean => !exclude.includes(n.type as string);
  }

  return !!entry && filter(entry) && filterAllow(entry) && filterExclude(entry);
};
