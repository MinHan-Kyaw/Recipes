"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

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
    <Card
      id={`meal-${slug}`}
      className="cursor-pointer h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1"
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <motion.div
          className="relative w-full h-48 overflow-hidden"
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
          <h2 className="m-0 text-2xl font-['Montserrat'] text-primary">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground italic">by {creator}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-base text-foreground/80">{summary}</p>
      </CardContent>
      <CardFooter className="text-left flex items-center text-primary">
        <Clock className="mr-2 h-4 w-4" />
        <span>40 mins</span>
      </CardFooter>
    </Card>
  );
}
