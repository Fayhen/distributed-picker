"use client";

import { useReducer, useState } from "react";
import { distributorReducer, getDefaultRange } from "./reducers";

export default function Home() {
  const [showSizeForm, setShowSizeForm] = useState(false)
  const [showStepForm, setShowStepForm] = useState(false)

  const [data, dispatch] = useReducer(distributorReducer, {
    ...getDefaultRange()
  })

  function handleToggleSizeForm () {
    setShowSizeForm(!showSizeForm)
  }

  function handleToggleStepForm () {
    setShowStepForm(!showStepForm)
  }

  function handleSetSize (e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'setSize',
      value: parseInt(e.target.value)
    })
  }

  function handleSetStep (e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: 'setStep',
      value: parseInt(e.target.value)
    })
  }
  
  function handleToggleSnap () {
    dispatch({
      type: 'setSnap',
      value: !data.snap
    })
  }

  function handleToggleStepInclusion () {
    dispatch({
      type: 'setStepInclusion',
      value: !data.includeStep
    })
  }

  function handleToggleLabelMode () {
    dispatch({
      type: 'setIndexedLabels',
      value: !data.indexLabels
    })
  }
  
  function SizeIndicator () {
    return (
      <div className="flex flex-row justify-center items-center w-64">
        Size: {data.size}
        <button onClick={handleToggleSizeForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold ml-4 py-1 px-4 rounded">
          Change
        </button>
      </div>
    )
  }

  function SizeIndicatorWithForm () {
    return (
      <div>
        <div className="flex flex-row justify-between items-center">
          Size: {data.size}
          <button onClick={handleToggleSizeForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded">
            Close
          </button>
        </div>
        <div className="mt-2">
          <input id="size-form" type="number" value={data.size} onChange={handleSetSize} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white" /> 
        </div>
      </div>
    )
  }

  function StepIndicator () {
    return (
      <div className="flex flex-row justify-center items-center w-64">
        Step: {data.displayedStep}
        <button onClick={handleToggleStepForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold ml-4 py-1 px-4 rounded">
          Change
        </button>
      </div>
    )
  }

  function StepIndicatorWithForm () {
    return (
      <div>
        <div className="flex flex-row justify-between items-center w-64">
          Step: {data.displayedStep}
          <button onClick={handleToggleStepForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded">
            Close
          </button>
        </div>
        <div className="mt-2">
          <input id="step-form" type="number" value={data.displayedStep} onChange={handleSetStep} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white" /> 
        </div>
      </div>
    )
  }

  function RangeBox(props: { label: string, paint: boolean }) {
    const { label, paint } = props
    const paintedStyle = "flex justify-center items-center bg-yellow-400 bg-gradient-to-b from-yellow-400 m-4 w-20 h-20 overflow-hidden backdrop-blur-2xl rounded-xl border dark:border-neutral-800 dark:from-inherit dark:bg-yellow-800"
    const unpaintedStyle = "flex justify-center items-center bg-gray-200 bg-gradient-to-b from-zinc-200 m-4 w-20 h-20 overflow-hidden backdrop-blur-2xl rounded-xl border dark:border-neutral-800 dark:from-inherit dark:bg-zinc-800/30"
    return <div className={ paint ? paintedStyle : unpaintedStyle }>{label}</div>
  }

  function RangeBoxes () {
    return data.range.map((index) => {
      const paint = data.indexes.includes(index)
      return <div key={index}>{RangeBox({ label: data.indexLabels ? `${index}` : `${index + 1}`, paint })}</div>
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center py-24 px-2">

      <div id="distribution-controls" className="flex flex-row flex-wrap justify-center items-center md:justify-around items-center w-full px-6 lg:px-24">
        <div className="flex flex-col m-2 w-64" >
          {
            showSizeForm 
              ? SizeIndicatorWithForm()
              : SizeIndicator()
          }
        </div>
        <div className="flex flex-col m-2 w-64">
          {
            showStepForm 
              ? StepIndicatorWithForm()
              : StepIndicator()
          }
        </div>
        <div className="flex flex-col justify-around m-2">
          <div className="flex items-center cursor-pointer">
            <input id="step-inclusion-checkbox" type="checkbox" defaultChecked={data.includeStep} onChange={handleToggleStepInclusion} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
            <label htmlFor="snap-checkbox" className="cursor-pointer ms-2 text-gray-900 dark:text-gray-300">Include steps</label>
          </div>
          <div className="flex items-center cursor-pointer">
            <input id="snap-checkbox" type="checkbox" onChange={handleToggleSnap} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
            <label htmlFor="snap-checkbox" className="cursor-pointer ms-2 text-gray-900 dark:text-gray-300">Snap to ends</label>
          </div>
          <div className="flex items-center cursor-pointer">
            <input id="snap-checkbox" type="checkbox" defaultChecked={data.indexLabels} onChange={handleToggleLabelMode} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
            <label htmlFor="snap-checkbox" className="cursor-pointer ms-2 text-gray-900 dark:text-gray-300">Index labels</label>
          </div>
        </div>
      </div>

      <div id="distribution-result" className="flex flex-row flex-wrap justify-center w-full my-10 px-6 lg:px-24">
        { RangeBoxes() }
      </div>
    </main>
  );
}
