import Link from "next/link";
import ImageSlideshow from "@/components/images/ImageSlideshow";

export default function Home() {
  return (
    <>
      <header className="flex flex-col md:flex-row gap-12 mx-auto my-12 w-[90%] max-w-6xl">
        <div className="w-full md:w-[40rem] h-[25rem]">
          <ImageSlideshow />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-[#2e8b57] text-2xl mb-4">
            <h1 className="text-2xl font-bold font-['Montserrat',sans-serif] tracking-wider uppercase bg-gradient-to-r from-[#2e8b57] to-[#daa520] bg-clip-text text-transparent">
              NextLevel Food for NextLevel Foodies
            </h1>
            <p className="mt-4">Taste & share food from all over the world.</p>
          </div>
          <div className="text-2xl flex flex-wrap gap-4">
            <Link
              href="/community"
              className="inline-block mt-4 px-4 py-2 rounded-lg font-bold text-[#2e8b57] border-2 border-[#2e8b57] transition-all duration-300 hover:bg-[rgba(46,139,87,0.1)] hover:text-[#1a5c3a]"
            >
              Join the Community
            </Link>
            <Link
              href="/meals"
              className="inline-block mt-4 px-4 py-2 rounded-lg font-bold bg-[#daa520] text-white transition-all duration-300 hover:bg-[#b8860b]"
            >
              Explore Meals
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="flex flex-col text-[#2e8b57] text-2xl max-w-3xl w-[90%] mx-auto my-8 text-center">
          <h2 className="text-[#4caf50] text-3xl font-bold mb-4">
            How it works
          </h2>
          <p className="mb-4">
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>

        <section className="flex flex-col text-[#2e8b57] text-2xl max-w-3xl w-[90%] mx-auto my-8 text-center">
          <h2 className="text-[#4caf50] text-3xl font-bold mb-4">
            Why NextLevel Food?
          </h2>
          <p className="mb-4">
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>
      </main>
    </>
  );
}
