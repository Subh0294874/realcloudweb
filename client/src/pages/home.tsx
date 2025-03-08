import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Categories from "@/components/categories";
import Comments from "@/components/comments";
import Footer from "@/components/footer";
import { ServerGrowth } from "@/components/server-growth";
import { Users } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { MemberCount } from "@/components/member-count";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[url(/banner.jpg)] bg-cover">
      <NavBar />
      {/* Hero Section */}
      <div 
        className="relative min-h-[60vh] flex items-center justify-center animated-gradient"
      >
        {/* Generate some stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Welcome to RealCloud
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Join our vibrant community of cloud technology enthusiasts. Share knowledge, get help, and connect with like-minded professionals.
          </p>
          <Button 
            size="lg"
            className="bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 transform hover:scale-105"
            onClick={() => window.open('https://discord.gg/realcloud', '_blank')}
          >
            Join Our Discord
          </Button>

          {/* Member Stats */}
          <div className="mt-6 flex justify-center gap-8">
            <MemberCount serverId={1327590678019964981} /> {/* Added MemberCount component */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span className="text-gray-200">144 Online Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discord Widget Section */}
      <div className="container my-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Card className="flex-1 backdrop-blur-sm bg-transparent">
            <CardContent className="p-6">
              <iframe 
                src="https://discord.com/widget?id=1327590678019964981&theme=dark" 
                width="100%" 
                height="500" 
                allowTransparency={true} 
                frameBorder="0" 
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="rounded-lg"
              />
            </CardContent>
          </Card>

          <div className="flex-1">
            <Categories />
          </div>
        </div>
      </div>

      {/* Server Growth Chart */}
      <div className="container mb-16">
        <ServerGrowth />
      </div>

      {/* Comments Section */}
      <div className="container mb-16">
        <Comments />
      </div>

      <Footer />
    </div>
  );
}