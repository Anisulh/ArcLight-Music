import React from 'react'

function ToolTip({text, children}) {
  return (
    <div className="flex flex-col items-center group relative transition-all">
      {children}
      <div className="bg-gray-800 absolute top-5 opacity-0 flex-col items-center mb-6 group-hover:top-10 group-hover:opacity-100  rounded-full transition-all delay-150">
        <span className="relative z-10 px-2 py-1 text-sm leading-none text-white whitespace-no-wrap bg-gray-800 shadow-lg rounded-md">{text}</span>
      </div>
    </div>
  )
}

export default ToolTip