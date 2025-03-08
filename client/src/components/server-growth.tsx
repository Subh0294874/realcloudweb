
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

// Function to generate last 6 months
const getLastSixMonths = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const date = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = new Date(date.getFullYear(), date.getMonth() - i, 1).getMonth();
    result.push(months[monthIndex]);
  }
  
  return result;
};

export function ServerGrowth() {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const response = await fetch('/api/discord-guild');
        if (!response.ok) {
          throw new Error('Failed to fetch member count');
        }
        const data = await response.json();
        setMemberCount(data.memberCount);
        
        // Generate growth data based on current member count
        const lastSixMonths = getLastSixMonths();
        const baseCount = Math.max(500, data.memberCount - 400);
        const increment = (data.memberCount - baseCount) / 5;
        
        const newData = lastSixMonths.map((month, index) => ({
          month,
          members: Math.round(baseCount + (increment * index))
        }));
        
        setGrowthData(newData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching member count:', error);
        // Fallback data
        const lastSixMonths = getLastSixMonths();
        const fallbackData = lastSixMonths.map((month, index) => ({
          month,
          members: 500 + (index * 200)
        }));
        setGrowthData(fallbackData);
        setIsLoading(false);
      }
    };

    fetchMemberCount();
  }, []);

  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChartIcon className="h-6 w-6" />
          Server Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        ) : (
          <div className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
