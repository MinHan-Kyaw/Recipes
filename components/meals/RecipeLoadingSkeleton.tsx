import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function RecipeLoadingSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="p-0">
        <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-4 pb-2 space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/5 bg-gray-200 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}
