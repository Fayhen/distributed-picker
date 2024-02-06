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
      value: !data.stepInclusion
    })
  }
  
  function SizeIndicator () {
    return (
      <div className="flex flex-row items-center w-64">
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
      <div className="flex flex-row items-center w-64">
        Step: {data.step}
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
          Step: {data.step}
          <button onClick={handleToggleStepForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded">
            Close
          </button>
        </div>
        <div className="mt-2">
          <input id="step-form" type="number" value={data.step} onChange={handleSetStep} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white" /> 
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
    const range = Array.from(Array(data.size).keys())
    return data.range.map((index) => {
      const paint = data.indexes.includes(index)
      return <div key={index}>{RangeBox({ label: `${index + 1}`, paint })}</div>
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">

      <div className="flex flex-row flex-wrap justify-around items-center w-full h-32 px-6">
        <div className="flex flex-col m-2 w-64">
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
        <div className="flex flex-col justify.around">
          <div className="flex items-center cursor-pointer">
            <input id="step-inclusion-checkbox" type="checkbox" defaultChecked={data.stepInclusion} onChange={handleToggleStepInclusion} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
            <label htmlFor="snap-checkbox" className="cursor-pointer ms-2 text-gray-900 dark:text-gray-300">Include steps</label>
          </div>
          <div className="flex items-center cursor-pointer">
            <input id="snap-checkbox" type="checkbox" onChange={handleToggleSnap} className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-md dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
            <label htmlFor="snap-checkbox" className="cursor-pointer ms-2 text-gray-900 dark:text-gray-300">Snap to ends</label>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap justify-center px-6 my-10">
        { RangeBoxes() }
      </div>
      {/* <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}
    </main>
  );
}
