import React, { useState, useEffect } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'
import Head from 'next/head'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [unclaimedSupply, setUnclaimedSupply] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [price, setPrice] = useState<string>('0')
  const [claimedNFT, setClaimedNFT] = useState<any>({})
  const [receit, setReceit] = useState<any>({})
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [purchaseDone, setPurchaseDone] = useState<boolean>(false)

  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  const nftDrop = useNFTDrop(collection.address)

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      const unclaimed = await nftDrop.getAllUnclaimed()
      const terms = await nftDrop.claimConditions.getAll()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setUnclaimedSupply(unclaimed.length)
      setPrice(terms?.[0].currencyMetadata.displayValue)

      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  const mintNft = () => {
    if (!nftDrop || !address) return

    const quantity = 1

    setLoading(true)
    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      },
    })

    nftDrop
      .claimTo(address, quantity)
      .then(async (transactionData) => {
        setPurchaseDone(true)
        const newReceit = transactionData[0].receipt
        const newClaimedNFT = await transactionData[0].data()

        setReceit(newReceit)
        setClaimedNFT(newClaimedNFT)
        console.log(newReceit)
        console.log(newClaimedNFT)

        toast('Hell Yeah! Your NFT is Minted', {
          duration: 8000,
          style: {
            background: 'green',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .catch((error) => {
        console.log(error)
        toast('Whoops... Something went wrong', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
        toast('Maybe you aint got no money', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Head>
        <title>New Age NFT | {collection.nftCollectionName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover transition-all duration-100 hover:scale-105 lg:h-96 lg:w-72"
              src={`${urlFor(collection.previewImage)}`}
              alt="NFT Monkey"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <div className="transition-all duration-100 hover:scale-105">
              <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-96">
                The{' '}
                <span className="font-extrabold underline decoration-pink-600/50">
                  New Age NFT
                </span>{' '}
                Market Place
              </h1>
            </div>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className={`rounded-full ${
              address ? 'bg-slate-700' : 'bg-rose-400'
            } px-4 py-2 text-xs font-bold text-white transition-all duration-100 hover:scale-105 lg:px-5 lg:py-2.5 lg:text-base`}
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="my-2 border" />

        {address && (
          <p className="text-center text-sm text-rose-400">
            You are logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}

        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          {purchaseDone ? (
            <Link href={collection.link}>
              <a target="_blank">
                <div className="group cursor-pointer overflow-hidden rounded-lg border bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
                  {/* the ! symbol protects from empty values */}
                  <img
                    className="mx-auto h-60 items-center"
                    src={claimedNFT.metadata.image}
                    alt={claimedNFT.metadata.name}
                  />
                  <div className="flex justify-between rounded-lg bg-white p-5">
                    <div>
                      <p className="p-2 text-lg font-bold">
                        ({claimedNFT.metadata.name}){' '}
                        <span className="text-green-400">Minted</span>
                      </p>
                      <p className="text-xs">
                        {receit.from.substring(
                          0,
                          5
                        )}
                        ...
                        {receit.from.substring(
                          receit.from.length -
                            5
                        )}{' '}
                        <span className="text-sm text-green-400">to</span>{' '}
                        {receit.to.substring(
                          0,
                          5
                        )}
                        ...
                        {receit.to.substring(
                          receit.to.length -
                            5
                        )}
                      </p>
                    </div>

                    <img
                      className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-purple-600"
                      src={urlFor(collection.mainImage).url()!}
                      alt={collection.description}
                    />
                  </div>
                </div>
              </a>
            </Link>
          ) : (
            <>
              <img
                className="w-80 object-cover pb-10 lg:h-40"
                src={`${urlFor(collection.mainImage)}`}
                alt="NFT Monkey Grid"
              />

              <Link href={collection.link}>
                <a target="_blank">
                  <h1 className="animate-bounce cursor-pointer text-3xl font-bold underline decoration-blue-500/75 lg:text-5xl lg:font-extrabold">
                    {collection.title}
                  </h1>
                </a>
              </Link>
            </>
          )}

          {loading ? (
            <img
              className="h-80 w-80 object-contain"
              src="/images/loading.gif"
              alt="Loading Symbol"
            />
          ) : (
            <>
              <p className="pt-2 text-xl text-green-500">
                {claimedSupply} / {totalSupply?.toString()} NTF's claimed
              </p>

              <div className="flex w-full flex-col items-center pt-2">
                <button
                  onClick={mintNft}
                  disabled={
                    loading ||
                    claimedSupply === totalSupply?.toNumber() ||
                    !address
                  }
                  className="mt-5 h-16 w-full rounded-full bg-red-600 text-white transition-all duration-100 hover:scale-105 disabled:bg-gray-400"
                >
                  {loading ? (
                    <>Loading</>
                  ) : claimedSupply === totalSupply?.toNumber() ? (
                    <>SOLD OUT</>
                  ) : !address ? (
                    <>Sign in to Mint</>
                  ) : (
                    <span className="font-bold">Mint NFT ({price} ETH)</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    link,
    nftCollectionName,
    mainImage {
      asset
    },
    previewImage {
      asset
    },
    slug {
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
