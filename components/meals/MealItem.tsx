"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MealItemProps {
  title: string;
  slug: string;
  image: string;
  summary: string;
  creator: string;
}

export default function MealItem({
  title,
  slug,
  image,
  summary,
  creator,
}: MealItemProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/meals/${slug}`);
  };

  return (
    <motion.article
      className="cursor-pointer flex flex-col justify-between h-full rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out bg-white text-[#333333] hover:shadow-lg hover:shadow-[rgba(46,139,87,0.2)] hover:-translate-y-1"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
    >
      <header>
        <motion.div
          className="relative w-full h-[200px] overflow-hidden"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </motion.div>
        <div className="p-4 pb-2">
          <h2 className="m-0 text-2xl font-['Montserrat'] text-[#2e8b57]">
            {title}
          </h2>
          <p className="text-sm text-[#666666] italic">by {creator}</p>
        </div>
      </header>
      <div className="flex flex-col justify-between h-full">
        <p className="px-4 text-base text-[#555555]">{summary}</p>
        <div className="p-4 text-left flex items-center text-[#2e8b57]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 align-middle"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>40 mins</span>
        </div>
      </div>
    </motion.article>
  );
}
