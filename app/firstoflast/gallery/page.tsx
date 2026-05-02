export default function GalleryPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
          FirstOfLast
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Gallery
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400">
          A visual gallery of collection images will appear here.
        </p>
      </div>
    </div>
  )
}