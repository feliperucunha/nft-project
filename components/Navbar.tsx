import React from 'react'

function Navbar({margin}: any) {
  return (
    <h1 className={`${margin ? 'mb-10 ' : ''}text-4xl font-extralight cursor-pointer`}>
      The{' '}
      <span className="font-extrabold underline decoration-pink-600/50">
        New Age NFT
      </span>{' '}
      Market Place
    </h1>
  )
}

export default Navbar
