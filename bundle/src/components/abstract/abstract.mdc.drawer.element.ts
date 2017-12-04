/**
 * @docs-private
 * Represents the different types of drawers that are supported: permanent, persistent, and temporary.
 */
export type MdcDrawerType = 'permanent' | 'persistent' | 'temporary';

/**
 * @docs-private
 * Base class for child elements of any type of drawer. The drawer will pass information to child
 * directives that provide themselve as <code>AbstractDrawerElement</code>.
*/
export abstract class AbstractDrawerElement {
    _drawerType: MdcDrawerType = 'permanent';
}
