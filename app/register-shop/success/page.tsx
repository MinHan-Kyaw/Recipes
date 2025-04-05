import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function RegistrationSuccess() {
  return (
    <div className="max-w-2xl mx-auto p-6 py-20 text-center">
      <div className="text-[#2e8b57] text-6xl mb-6 flex justify-center">
        <CheckCircle />
      </div>

      <h1 className="text-3xl font-bold mb-4 text-[#2e8b57]">
        Registration Successful!
      </h1>

      <p className="text-lg mb-8">
        Thank you for registering your shop with NextLevel Food. Your
        information has been submitted and is under review. You will receive a
        confirmation email shortly.
      </p>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-[#2e8b57] text-white rounded-md hover:bg-[#236b43] transition-colors"
        >
          Return to Home
        </Link>

        <Link
          href="/recipes"
          className="px-6 py-3 bg-white border border-[#2e8b57] text-[#2e8b57] rounded-md hover:bg-gray-50 transition-colors"
        >
          Browse Meals
        </Link>
      </div>
    </div>
  );
}
