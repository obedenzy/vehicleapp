import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Users, Trophy, Gift } from 'lucide-react';

export default function EarnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Earn Tokens</h1>
          <p className="text-muted-foreground">Complete tasks to earn free tokens</p>
        </div>
        <Button size="lg">
          <Share2 className="mr-2 h-4 w-4" />
          Share & Earn
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">5</span>
          </div>
          <h2 className="text-lg font-semibold mb-1">Referrals</h2>
          <p className="text-sm text-muted-foreground">Users invited</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">120</span>
          </div>
          <h2 className="text-lg font-semibold mb-1">Points</h2>
          <p className="text-sm text-muted-foreground">Earned from activities</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">25</span>
          </div>
          <h2 className="text-lg font-semibold mb-1">Rewards</h2>
          <p className="text-sm text-muted-foreground">Available to claim</p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Share on Social Media</h3>
                  <p className="text-sm text-muted-foreground">Share your vehicle analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">+5 Tokens</div>
                <Button size="sm" variant="outline">Share</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Invite Friends</h3>
                  <p className="text-sm text-muted-foreground">Get tokens for each referral</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">+10 Tokens</div>
                <Button size="sm" variant="outline">Invite</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Complete 5 Analyses</h3>
                  <p className="text-sm text-muted-foreground">Analyze 5 different vehicles</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">+15 Tokens</div>
                <div className="text-sm text-muted-foreground">2/5 completed</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Referral Program</h2>
          <p className="text-muted-foreground mb-4">
            Share your unique referral code with friends and earn tokens when they join
          </p>
          <div className="flex gap-4">
            <Card className="flex-1 p-4 bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Your Referral Code</p>
              <p className="font-mono font-semibold">VEHICLE123</p>
            </Card>
            <Button>Copy Code</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
