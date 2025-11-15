import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ThumbsUp, MessageCircle } from "lucide-react";

interface FoodCardProps {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  upvotes: number;
  answers: number;
  verified?: boolean;
}

const FoodCard = ({
  id,
  title,
  location,
  category,
  description,
  upvotes,
  answers,
  verified = false,
}: FoodCardProps) => {
  return (
    <Link to={`/question/${id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-b from-card to-background border-border/50">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{title}</h3>
            {verified && (
              <Badge variant="secondary" className="shrink-0">
                ✓ Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          <Badge variant="outline" className="mt-3">
            {category}
          </Badge>
        </CardContent>
        
        <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{answers}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default FoodCard;
