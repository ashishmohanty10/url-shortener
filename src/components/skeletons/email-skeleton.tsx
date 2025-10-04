export function EmailSkeleton() {
  return (
    <div className="h-fit md:h-[30rem] w-full max-w-3xl rounded-md bg-neutral-800 p-6 animate-pulse">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="col-span-1 w-full rounded-md md:mb-0 relative h-full md:h-auto bg-neutral-700"></div>
        <div>
          <div className="h-6 w-1/3 bg-neutral-700 rounded mb-4"></div>
          <div className="h-10 w-full bg-neutral-700 rounded mb-3"></div>
          <div className="h-10 w-full bg-neutral-700 rounded mb-3"></div>
          <div className="h-10 w-1/2 bg-neutral-700 rounded mt-4"></div>
        </div>
      </div>
    </div>
  )
}
