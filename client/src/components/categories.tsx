import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Server, Shield, Code, Database, Network } from "lucide-react";

const categories = [
  {
    icon: Cloud,
    title: "Cloud Platforms",
    description: "AWS, Azure, GCP, and other cloud service providers"
  },
  {
    icon: Server,
    title: "DevOps",
    description: "CI/CD, containerization, and infrastructure as code"
  },
  {
    icon: Shield,
    title: "Security",
    description: "Cloud security, compliance, and best practices"
  },
  {
    icon: Code,
    title: "Development",
    description: "Cloud-native development and serverless computing"
  },
  {
    icon: Database,
    title: "Data & Storage",
    description: "Cloud databases, storage solutions, and data management"
  },
  {
    icon: Network,
    title: "Networking",
    description: "Cloud networking, CDN, and connectivity"
  }
];

export default function Categories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explore Topics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
            >
              <Icon className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">{category.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
