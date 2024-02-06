import { skip } from "node:test"

export type RangeData = {
  snap: boolean
  size: number
  step: number
  stepInternal: number
  stepInclusion: boolean
  range: number[]
  indexes: number[]
}

type SnapActionData = {
  type: 'setSnap'
  value: boolean
}

type SizeActionData = {
  type: 'setSize'
  value: number
}

type StepActionData = {
  type: 'setStep'
  value: number
}

type StepInclusionActionData = {
  type: 'setStepInclusion'
  value: boolean
}


type ActionData = SizeActionData | StepActionData | StepInclusionActionData | SnapActionData

function computeBoundDistribution (data: RangeData): RangeData {
  console.log('computing bound')
  const { size, stepInternal } = data
  const range: number[] = size > 0
    ? [ ...Array(size).keys() ]
    : []

  if (size <= 0 || stepInternal <= 0) {
    return {
      ...data,
      range,
      indexes: []
    }
  }
  if (stepInternal > size) {
    return {
      ...data,
      range,
      indexes: [0]
    }
  }
  if (stepInternal === 1) {
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
    if (currentIndex === 0 && stepInternal > 1) {
      currentIndex += (stepInternal - 1)
    }
    else {
      currentIndex += stepInternal
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

function computeUnboundDistribution(data: RangeData): RangeData {
  console.log('computing unbound')
  const { size, stepInternal } = data

  const range = [ ...Array(size).keys() ]

  let indexes: number[] = []
  let currentIndex = 0
  let isDone = false

  while (!isDone) {
    if (currentIndex >= range.length) {
      isDone = true
    }
    indexes.push(currentIndex)
    currentIndex += stepInternal
  }

  return { ...data, range, indexes }
}

function computeDistribution (data: RangeData): RangeData {
  return data.snap
    ? computeBoundDistribution(data)
    : computeUnboundDistribution(data)
}

export function getDefaultRange (): RangeData {
  return computeDistribution({
    size: 10,
    step: 2,
    stepInternal: 2,
    stepInclusion: true,
    snap: false,
    range: [],
    indexes: []
  })
}

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
      if (action.value === data.step) {
        return data
      }
      if (!action.value || action.value <= 1) {
        return {
          ...data,
          step: 1,
          stepInternal: data.stepInclusion ? action.value : action.value + 1,
        }
      }
      return {
        ...data,
        step: action.value,
        stepInternal: data.stepInclusion ? action.value : action.value + 1,
      }
    }
    case 'setStepInclusion': {
      if (action.value === data.stepInclusion) {
        return data
      }
      return {
        ...data,
        stepInternal: action.value ? data.step : data.step + 1,
        stepInclusion: action.value
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
    default: {
      console.error(`Invalid action data: ${action}`)
      throw new Error('Invalid action data.')
    }
  }
}

export function distributorReducer(data: RangeData, action: ActionData): RangeData {
  let newRange = setRangeProperties(data, action)
  newRange = computeDistribution(newRange)
  return newRange
}
