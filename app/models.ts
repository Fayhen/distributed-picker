/**
 * Range data and application state.
 */
export type RangeData = {
  /**
   * Snapping flag. Causes the first and last indexes to always be
   * picked when computing distributions.
   */
  snap: boolean
  /**
   * Range size. How many indexes it contains.
   */
  size: number
  /**
   * Displayed step value. The value that is displayed on the UI.
   */
  displayedStep: number
  /**
   * Internal step value. The value that's actually used for index
   * picking computation. May differ from the displayed step based
   * on computation settings.
   */
  internalStep: number
  /**
   * Step inclusion flag. Controls whether the stepped-on indexes
   * are picked or skipped.
   */
  includeStep: boolean
  /**
   * Index label displaying flag. Controls where the range labels
   * shown on the UI either corresponds to array indexes or cardinal
   * numbers.
   */
  indexLabels: boolean
  /**
   * Computed range. A integer array generated through the `size`
   * property.
   */
  range: number[]
  /**
   * Picked indexes. Causes the UI to highlight corresponding elements
   * upon rendering.
   */
  indexes: number[]
}

/**
 * Snap setter action data. Upon dispatch, sets the `snap` flag value
 * and reruns the index picking computation.
 */
export type SnapActionData = {
  type: 'setSnap'
  value: boolean
}

/**
 * Size setter action data. Upon dispatch, sets the range size value
 * and reruns the index picking computation.
 */
export type SizeActionData = {
  type: 'setSize'
  value: number
}

/**
 * Step setter action data. Upon dispatch, sets the `displayedStep` 
 * value, computes the `internalStep` value based on other range
 * properties and finally reruns the index picking computation.
 */
export type StepActionData = {
  type: 'setStep'
  value: number
}

/**
 * Step inclusion setter action data. Upon dispatch, sets the
 * `includeStep` flag value and reruns the index picking computation.
 */
export type StepInclusionActionData = {
  type: 'setStepInclusion'
  value: boolean
}

/**
 * Label display mode action data. Sets the `indexLabels` range
 * property.
 */
export type LabelModeActionData = {
  type: 'setIndexedLabels'
  value: boolean
}

/**
 * Valid reducer actions.
 */
export type ActionData = SizeActionData | StepActionData |
  StepInclusionActionData | SnapActionData |LabelModeActionData