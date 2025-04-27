"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Star, User, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../AuthProvider";
import { addRating, getRatings } from "@/lib/api/rate";
import { addComment, getComments } from "@/lib/api/comment";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface RatingsAndCommentsProps {
  recipeId: string;
}

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  text: string;
  createdAt: string;
}

export default function RatingsAndComments({
  recipeId,
}: RatingsAndCommentsProps) {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchRatingsAndComments = async () => {
      try {
        const ratingsResponse = await getRatings(recipeId);
        if (ratingsResponse.success) {
          if (user?._id && ratingsResponse.data.userRating) {
            setUserRating(ratingsResponse.data.userRating);
          }
          setAverageRating(ratingsResponse.data.averageRating);
          setRatingsCount(ratingsResponse.data.ratingsCount);
        }
        const commentsResponse = await getComments(recipeId);
        if (commentsResponse.success) {
          setComments(commentsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching ratings and comments:", error);
      }
    };

    if (recipeId) {
      fetchRatingsAndComments();
    }
  }, [recipeId, user]);

  const handleRatingClick = async (rating: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to rate this recipe.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user._id) {
        throw new Error("User ID is required");
      }
      const data = await addRating(recipeId, rating, user._id);
      if (!data) {
        toast({
          title: "Error",
          description: "Failed to submit rating. Please try again.",
          variant: "destructive",
        });
      }
      setUserRating(rating);
      setAverageRating(data.averageRating);
      setRatingsCount(data.ratingsCount);
      toast({
        title: "Rating Submitted",
        description: `You rated this recipe ${rating} out of 5.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (!user._id) {
        throw new Error("User ID is required");
      }
      const data = await addComment(recipeId, user._id, comment);
      const newComment = data.comment;
      setComments([newComment, ...comments]);
      setComment("");
      toast({
        title: "Comment Submitted",
        description: "Your comment has been posted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate stars for rating display
  const renderStars = (rating: number | null, interactive = false) => {
    const stars = [];
    const activeRating =
      interactive && hoveredRating !== null ? hoveredRating : rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.button
          key={i}
          type={interactive ? "button" : undefined}
          disabled={isSubmitting}
          className={`${
            interactive ? "cursor-pointer" : ""
          } focus:outline-none`}
          onClick={interactive ? () => handleRatingClick(i) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(null) : undefined}
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
        >
          <Star
            className={`h-6 w-6 ${
              activeRating && i <= activeRating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </motion.button>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const commentItem = (comment: Comment) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={comment._id}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4"
    >
      <div className="flex items-start">
        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
          {comment.user.image ? (
            <AvatarImage src={comment.user.image} alt={comment.user.name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {comment.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-900">{comment.user.name}</div>
            <div className="flex items-center text-gray-500 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(comment.createdAt)}
            </div>
          </div>
          <p className="mt-2 text-gray-700">{comment.text}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Rating Overview Panel */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <Star className="w-5 h-5 mr-2 text-primary" />
              Recipe Rating
            </h3>
            {averageRating !== null ? (
              <div className="flex items-end">
                <span className="text-4xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-lg text-gray-500 ml-1 mb-1">/5</span>
                <Badge variant="outline" className="ml-3 mb-1">
                  {ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No ratings yet</p>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end">
            <p className="text-sm font-medium mb-2">
              {userRating ? "Your rating" : "Rate this recipe"}
            </p>
            <div className="flex">{renderStars(userRating, true)}</div>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="space-y-6">
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between">
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="text-sm">
                All Comments ({comments.length})
              </TabsTrigger>
              <TabsTrigger value="add" className="text-sm">
                Add Comment
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {comments.length > 0 ? (
              <div className="space-y-1">
                {comments.map((comment) => commentItem(comment))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No comments yet
                </h3>
                <p className="text-gray-500 mt-2">
                  Be the first to share your thoughts!
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab("add")}
                >
                  Add a Comment
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                Share Your Thoughts
              </h3>

              {user ? (
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>

                  <Textarea
                    placeholder="What did you think about this recipe?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={isSubmitting}
                    className="min-h-[120px] border-gray-200 focus:border-primary focus:ring-primary"
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !comment.trim()}
                      className="transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⏳</span>
                          Posting...
                        </span>
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Sign in to comment
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Please sign in to share your thoughts about this recipe
                  </p>
                  <Button variant="outline" className="mt-4">
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
