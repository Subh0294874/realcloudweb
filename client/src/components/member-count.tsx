
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface MemberCountProps {
  serverId?: number;
}

export function MemberCount({ serverId }: MemberCountProps) {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemberCount() {
      try {
        const response = await fetch('/api/discord-guild');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setMemberCount(data.memberCount);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching member count:', err);
        setError('Failed to load member count');
        setIsLoading(false);
      }
    }

    fetchMemberCount();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5 text-[#5865F2]" />
      <span className="text-gray-200">
        {isLoading ? 'Loading members...' : 
         error ? '1,500+ Total Members' : 
         `${memberCount?.toLocaleString()} Total Members`}
      </span>
    </div>
  );
}
