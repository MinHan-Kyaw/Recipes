import React from "react";
import Image from "next/image";
import mealIcon from "@/assets/icons/meal.png";
import communityIcon from "@/assets/icons/community.png";
import eventsIcon from "@/assets/icons/events.png";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-amber-50 opacity-80"></div>
        <div className="relative z-10 container mx-auto px-4 py-24">
          <header className="flex flex-col items-center justify-center text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-['Montserrat'] uppercase tracking-wider">
              One shared passion:{" "}
              <span className="bg-gradient-to-r from-[#2e8b57] to-[#daa520] bg-clip-text text-transparent">
                Food
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-emerald-800 max-w-2xl font-light">
              Join our community and share your favorite recipes!
            </p>
          </header>
        </div>

        {/* Decorative wave shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-12 text-emerald-800 font-['Montserrat'] uppercase tracking-wider">
          Community Perks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Perk 1 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-6 relative">
                <Image
                  src={mealIcon}
                  alt="A delicious meal"
                  layout="fill"
                  objectFit="contain"
                  className="drop-shadow-md"
                  style={{
                    filter: "drop-shadow(0 0 0.5rem rgba(46, 139, 87, 0.2))",
                  }}
                />
              </div>
              <p className="text-xl font-semibold text-[#2e8b57]">
                Share & discover recipes
              </p>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-amber-200 transition-all duration-300 hover:-translate-y-1 border border-amber-100">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-6 relative">
                <Image
                  src={communityIcon}
                  alt="A crowd of people, cooking"
                  layout="fill"
                  objectFit="contain"
                  className="drop-shadow-md"
                  style={{
                    filter: "drop-shadow(0 0 0.5rem rgba(218, 165, 32, 0.2))",
                  }}
                />
              </div>
              <p className="text-xl font-semibold text-[#daa520]">
                Find new friends & like-minded people
              </p>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-emerald-200 transition-all duration-300 hover:-translate-y-1 border border-emerald-100">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-6 relative">
                <Image
                  src={eventsIcon}
                  alt="A crowd of people at a cooking event"
                  layout="fill"
                  objectFit="contain"
                  className="drop-shadow-md"
                  style={{
                    filter: "drop-shadow(0 0 0.5rem rgba(46, 139, 87, 0.2))",
                  }}
                />
              </div>
              <p className="text-xl font-semibold text-[#2e8b57]">
                Participate in exclusive events
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <button className="px-8 py-3 bg-gradient-to-r from-[#2e8b57] to-[#4caf50] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            Join Our Community
          </button>
        </div>
      </main>
    </div>
  );
}
