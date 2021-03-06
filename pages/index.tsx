import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'
import Navbar from '../components/Navbar'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col py-20 px-10 2xl:px-0">
      <Head>
        <title>New Age NFT | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar margin={true} />

      <main className="bg-slate-100 p-10 shadow-xl shadow-rose-400/20">
        <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {collections.map((collection) => (
            <Link href={`/nft/${collection.slug.current}`}>
              <div
                key={collection.id}
                className="flex cursor-pointer flex-col items-center transition-all duration-200 hover:scale-105"
              >
                <img
                  className="h-96 w-60 rounded-2xl object-cover"
                  src={`${urlFor(collection.mainImage)}`}
                  alt={collection.title}
                />

                <div className="p-4 pb-1">
                  <h2 className="text-2xl">{collection.title}</h2>
                </div>
                <p className="text-sm text-gray-400 pb-3">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `
  *[_type == "collection"]{
    _id,
    title,
    address,
    description,
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

  const collections = await sanityClient.fetch(query)

  return {
    props: {
      collections,
    },
  }
}
