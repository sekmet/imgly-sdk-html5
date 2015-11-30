/** @jsx ReactBEM.createElement **/
/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import { ReactBEM, Constants } from '../../../../globals'
import ControlsComponent from '../../controls-component'
import SliderComponent from '../../../slider-component'

export default class TiltShiftControlsComponent extends ControlsComponent {
  constructor (...args) {
    super(...args)

    this._hasDoneButton = true
    this._operation = this.getSharedState('operation')
    this._bindAll(
      '_onBackClick',
      '_onDoneClick',
      '_onSliderValueChange',
      '_onOperationRemoved'
    )

    this._events = {
      [Constants.EVENTS.OPERATION_REMOVED]: this._onOperationRemoved
    }
  }

  // -------------------------------------------------------------------------- LIFECYCLE

  /**
   * Gets called when this component has been mounted
   */
  componentDidMount () {
    super.componentDidMount()

    this._emitEvent(Constants.EVENTS.CANVAS_ZOOM, 'auto', () => {
      this._emitEvent(Constants.EVENTS.EDITOR_DISABLE_FEATURES, ['zoom', 'drag'])
      this.props.sharedState.broadcastUpdate()
    })
  }

  // -------------------------------------------------------------------------- EVENTS

  /**
   * Gets called when an operation is removed
   * @return {Operation} operation
   * @private
   */
  _onOperationRemoved (operation) {
    if (operation !== this._operation) return

    // Operation can be removed by the undo button. We need
    // to make sure we re-create the operation for the lifetime
    // of this control
    const { ui } = this.context
    const newOperation = ui.getOrCreateOperation('tilt-shift')
    this._operation = newOperation
    this.setSharedState({
      operation: newOperation,
      operationExistedBefore: false,
      initialOptions: {}
    })
  }

  /**
   * Gets called when the user clicks the back button
   * @param {Event} e
   * @private
   */
  _onBackClick (e) {
    super._onBackClick(e)

    const { ui } = this.context
    if (!this.getSharedState('operationExistedBefore')) {
      ui.removeOperation(this._operation)
    } else {
      this._operation.set(this.getSharedState('initialOptions'))
    }

    this._emitEvent(Constants.EVENTS.CANVAS_RENDER)

    this._emitEvent(Constants.EVENTS.CANVAS_UNDO_ZOOM)
    this._emitEvent(Constants.EVENTS.EDITOR_ENABLE_FEATURES, ['zoom', 'drag'])
  }

  /**
   * Gets called when the user clicks the done button
   * @param  {Event} e
   * @private
   */
  _onDoneClick (e) {
    const { editor } = this.props
    const operationExistedBefore = this.getSharedState('operationExistedBefore')
    const initialOptions = this.getSharedState('initialOptions')
    const optionsChanged = !this._operation.optionsEqual(initialOptions)

    if (optionsChanged || !operationExistedBefore) {
      editor.addHistory(this._operation,
        this.getSharedState('initialOptions'),
        this.getSharedState('operationExistedBefore'))
    }

    this._emitEvent(Constants.EVENTS.CANVAS_UNDO_ZOOM)
    this._emitEvent(Constants.EVENTS.EDITOR_ENABLE_FEATURES, ['zoom', 'drag'])
    super._onDoneClick(e)
  }

  /**
   * Gets called when the slider value has changed
   * @param {Number} value
   * @private
   */
  _onSliderValueChange (value) {
    this._operation.setBlurRadius(value)
    this._emitEvent(Constants.EVENTS.CANVAS_RENDER)
  }

  // -------------------------------------------------------------------------- RENDERING

  /**
   * Renders the controls of this component
   * @return {ReactBEM.Element}
   */
  renderControls () {
    return (<div bem='e:cell m:slider'>
      <SliderComponent
        style='large'
        minValue={0}
        maxValue={40}
        valueUnit='px'
        middleDot={false}
        label={this._t('controls.focus.blurRadius')}
        onChange={this._onSliderValueChange}
        value={this._operation.getBlurRadius()} />
    </div>)
  }
}
