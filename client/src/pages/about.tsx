import { FaCode, FaUsers, FaDiscord, FaLaptopCode } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "@/components/nav-bar";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <div className="container my-12 flex-1">
        <h1 className="text-4xl font-bold mb-8 text-center">About RealCloud</h1>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FaDiscord className="text-primary" />
              .gg/realcloud
            </CardTitle>
            <CardDescription>
              Your ultimate destination for coding mastery and system exploration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Welcome to <span className="font-semibold text-primary">RealCloud</span> - the premier Discord community
              for coders and crackers. Our server is the go-to destination for those who want to master both the art
              of coding and the intricacies of system exploration.
            </p>

            <p>
              At RealCloud, we've built a dynamic community that embraces both innovative coding practices and
              reverse engineering skills. Whether you're developing new applications or analyzing existing systems,
              our community provides the knowledge and support you need to excel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center p-4 border rounded-lg bg-card/50">
                <FaCode className="text-4xl text-primary mb-3" />
                <h3 className="text-xl font-medium mb-2">Advanced Coding</h3>
                <p className="text-center text-sm">
                  Level up your programming skills with expert guidance and practical challenges
                </p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg bg-card/50">
                <FaLaptopCode className="text-4xl text-primary mb-3" />
                <h3 className="text-xl font-medium mb-2">System Analysis</h3>
                <p className="text-center text-sm">
                  Deep dive into system architectures and enhance your understanding of software internals
                </p>
              </div>

              <div className="flex flex-col items-center p-4 border rounded-lg bg-card/50">
                <FaUsers className="text-4xl text-primary mb-3" />
                <h3 className="text-xl font-medium mb-2">Community Support</h3>
                <p className="text-center text-sm">
                  Connect with skilled peers who share your passion for technical exploration
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg font-medium mb-2">Join the elite coding community!</p>
              <a href="https://discord.gg/realcloud" 
                 className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Join Discord Server
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} RealCloud. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}