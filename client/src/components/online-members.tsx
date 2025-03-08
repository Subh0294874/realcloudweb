import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { SiDiscord } from "react-icons/si";

const onlineMembers = [
  { name: 'vc', members: ['Subh Here <3'] },
  { name: 'muzic', members: [
    '! Devv',
    '! Asura4ever <3',
    '! TROPIC<3',
    '! Sureaaaa',
    '! RC -/R /v',
    '! RC - ItsNickOp',
    '! ich.ly',
    '! DereK !',
    '! I.C.E',
    '! Mark < 3 0 ?',
    '! GaF_xd'
  ]},
];

export function OnlineMembers() {
  return (
    <Card className="backdrop-blur-sm bg-card/30">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <SiDiscord className="h-6 w-6 text-[#5865F2]" />
          <span>RealCloud Community</span>
          <div className="ml-auto flex items-center gap-2 text-sm font-normal">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500">144 Online</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {onlineMembers.map((channel) => (
          <div key={channel.name} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              {channel.name}
            </div>
            <div className="space-y-2">
              {channel.members.map((member) => (
                <div
                  key={member}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-all"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      {member[0]}
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <span className="text-sm font-medium">{member}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
