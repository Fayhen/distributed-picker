import { RangeData, ActionData } from './models'

/**
 * Computes index distribution with endpoints inclusion.
 *
 * @param data Current range data.
 * @returns Updated range data.
 */
function computeBoundDistribution (data: RangeData): RangeData {
  console.log('computing bound')
  const { size, internalStep } = data
  const range: number[] = size > 0
    ? [ ...Array(size).keys() ]
    : []

  if (size <= 0 || internalStep <= 0) {
    return {
      ...data,
      range,
      indexes: []
    }
  }
  if (internalStep > size) {
    return {
      ...data,
      range,
      indexes: [0]
    }
  }
  if (internalStep === 1) {
    return {
      ...data,
      range,
      indexes: [ ...range ]
    }
  }

  const mutatingRange: number[] = [ ...range ]
  const indexes: number[] = []

  indexes.push(0)
  indexes.push(range[range.length - 1])
  mutatingRange.shift()
  mutatingRange.pop()
  console.log({ range, mutatingRange, indexes })
  
  let currentIndex = 0
  let isDone = false
  while (!isDone) {
    if (currentIndex === 0 && internalStep > 1) {
      currentIndex += (internalStep - 1)
    }
    else {
      currentIndex += internalStep
    }

    isDone = currentIndex > (mutatingRange.length - 1)
    if (!isDone) {
      console.log(mutatingRange[currentIndex])
      indexes.push(mutatingRange[currentIndex])
    }
  }

  return {
    ...data,
    range,
    indexes
  }
}

/**
 * Computes index distribution without endpoints inclusion.
 *
 * @param data Current range data.
 * @returns Updated range data.
 */
function computeUnboundDistribution(data: RangeData): RangeData {
  console.log('computing unbound')
  const { size, internalStep } = data

  const range = [ ...Array(size).keys() ]

  let indexes: number[] = []
  let currentIndex = 0
  let isDone = false

  while (!isDone) {
    if (currentIndex >= range.length) {
      isDone = true
    }
    indexes.push(currentIndex)
    currentIndex += internalStep
  }

  return { ...data, range, indexes }
}

/**
 * Computes index distribution according to current range properties.
 *
 * @param data Current range data.
 * @returns Updated range data.
 */
function computeDistribution (data: RangeData): RangeData {
  return data.snap
    ? computeBoundDistribution(data)
    : computeUnboundDistribution(data)
}

/**
 * Default range data getter.
 *
 * @returns Default range data.
 */
export function getDefaultRange (): RangeData {
  return computeDistribution({
    snap: false,
    size: 10,
    displayedStep: 2,
    internalStep: 2,
    includeStep: true,
    indexLabels: false,
    range: [],
    indexes: []
  })
}

/**
 * Sets range properties according to dispatched actions. Index
 * distribution computation must be triggered after running this
 * handler.
 *
 * @param data Current range data.
 * @param action Dispatched action data.
 * @returns Updated range data.
 */
function setRangeProperties(data: RangeData, action: ActionData): RangeData {
  switch (action.type) {
    case 'setSize': {
      if (action.value === data.size) {
        return data
      }
      if (!action.value || action.value <= 1) {

        return {
          ...data,
          size: 1
        }
      }
      return {
        ...data,
        size: action.value
      }
    }
    case 'setStep': {
      if (action.value === data.displayedStep) {
        return data
      }
      if (!action.value || action.value <= 1) {
        return {
          ...data,
          displayedStep: 1,
          internalStep: data.includeStep ? action.value : action.value + 1,
        }
      }
      return {
        ...data,
        displayedStep: action.value,
        internalStep: data.includeStep ? action.value : action.value + 1,
      }
    }
    case 'setStepInclusion': {
      if (action.value === data.includeStep) {
        return data
      }
      return {
        ...data,
        internalStep: action.value ? data.displayedStep : data.displayedStep + 1,
        includeStep: action.value
      }
    }
    case 'setSnap': {
      if (action.value === data.snap) {
        return data
      }
      return {
        ...data,
        snap: action.value
      }
    }
    case 'setIndexedLabels': {
      if (action.value === data.indexLabels) {
        return data
      }
      return {
        ...data,
        indexLabels: action.value
      }
    }
    default: {
      console.error(`Invalid action data: ${action}`)
      throw new Error('Invalid action data.')
    }
  }
}

/**
 * Range properties reducer. Performs dispatched actions and computes
 * subsequent changes.
 *
 * @param data Current range data.
 * @param action Dispatched action data.
 * @returns Updated range data.
 */
export function distributorReducer(data: RangeData, action: ActionData): RangeData {
  let newRange = setRangeProperties(data, action)
  // TODO: Prevent recomputing if the state has not changed.
  newRange = computeDistribution(newRange)
  return newRange
}
