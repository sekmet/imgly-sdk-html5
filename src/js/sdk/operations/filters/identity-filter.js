/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import Filter from './filter'

/**
 * Identity Filter
 * @class
 * @alias PhotoEditorSDK.Filters.IdentityFilter
 * @extends {PhotoEditorSDK.Filter}
 */
class IdentityFilter extends Filter {
  /**
   * A unique string that identifies this operation. Can be used to select
   * the active filter.
   * @type {String}
   */
  static get identifier () {
    return 'identity'
  }

  /**
   * The name that is displayed in the UI
   * @type {String}
   */
  get name () {
    return 'Original'
  }

  /**
   * Specifies whether this filter is an identity filter
   * @return {Boolean}
   */
  static get isIdentity () { return true }

  /**
   * Renders the filter
   * @return {Promise}
   */
  render () {
    return Promise.resolve()
  }
}

export default IdentityFilter