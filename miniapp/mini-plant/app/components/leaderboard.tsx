import React, { useState, useEffect } from 'react';

interface MintData {
  owner: string;
}

interface LeaderboardEntry {
  address: string;
  mintCount: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('https://api.studio.thegraph.com/query/111655/base-mini-plant/version/latest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: '{ plantMinteds(first: 1000) { owner } }'
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        // Count mints per address
        const mintCounts: { [key: string]: number } = {};
        data.data.plantMinteds.forEach((mint: MintData) => {
          const owner = mint.owner.toLowerCase();
          mintCounts[owner] = (mintCounts[owner] || 0) + 1;
        });

        // Convert to array and sort by mint count
        const leaderboardData: LeaderboardEntry[] = Object.entries(mintCounts)
          .map(([address, count]) => ({
            address,
            mintCount: count,
          }))
          .sort((a, b) => b.mintCount - a.mintCount)
          .slice(0, 10); // Top 10

        setLeaderboard(leaderboardData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard data');
        console.error('Leaderboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[var(--app-foreground-muted)]">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">Top Minters</h2>
        <p className="text-[var(--app-foreground-muted)]">Most active flower growers</p>
      </div>

      <div className="bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="p-6 text-center text-[var(--app-foreground-muted)]">
            No mint data available yet
          </div>
        ) : (
          <div className="divide-y divide-[var(--app-card-border)]">
            {leaderboard.map((entry, index) => (
              <div key={entry.address} className="flex items-center justify-between p-4 hover:bg-[var(--app-card-bg-hover)] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-[var(--app-gray)] text-[var(--app-foreground-muted)]'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--app-foreground)]">
                      {formatAddress(entry.address)}
                    </div>
                    <div className="text-sm text-[var(--app-foreground-muted)]">
                      {entry.mintCount} {entry.mintCount === 1 ? 'mint' : 'mints'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[var(--app-accent)]">
                    {entry.mintCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default Leaderboard;
