import React from 'react'

function NFTDropPage() {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="/images/monke.png"
              alt="NFT Monkey"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">New Age Apes</h1>
            <h2 className="text-xl text-gray-300">
              A collection of hipster Apes living Next.js
            </h2>
          </div>
        </div>
      </div>

      <div>

      </div>
    </div>
  )
}

export default NFTDropPage
