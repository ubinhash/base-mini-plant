import React, { useState, useEffect } from 'react';
import { useAccount } from "wagmi";
import RenderFlower from './renderflower';

interface VaultedFlower {
  tokenId: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface Achievement {
  achievementId: string;
  tokenId: string;
  blockTimestamp: string;
  transactionHash: string;
}

const ACHIEVEMENTS = [
  {
    id: "1",
    name: "Rainbow Set",
    description: "Grow 8 unique colored petals",
    icon: "🌈"
  },
  {
    id: "2",
    name: "Many Pedals", 
    description: "Grow 6+ petals on a flower",
    icon: "🌺"
  },
  {
    id: "3",
    name: "Keep Vaulting",
    description: "Vault 5+ flowers",
    icon: "🏛️"
  },
  {
    id: "4",
    name: "ALL RED",
    description: "Grow all red petals (3+ petals)",
    icon: "🌹"
  }
];

const Vault: React.FC = () => {
  const { address } = useAccount();
  const [vaultedFlowers, setVaultedFlowers] = useState<VaultedFlower[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVaultData() {
      if (!address) {
        setVaultedFlowers([]);
        setAchievements([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch vaulted flowers
        const vaultResponse = await fetch('https://api.studio.thegraph.com/query/111655/base-mini-plant/version/latest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `{
              plantVaulteds(where: { owner: "${address.toLowerCase()}" }) {
                tokenId
                blockTimestamp
                transactionHash
              }
            }`
          }),
        });

        // Fetch achievements
        const achievementResponse = await fetch('https://api.studio.thegraph.com/query/111655/base-mini-plant/version/latest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `{
              achievementUnlockeds(where: { user: "${address.toLowerCase()}" }) {
                achievementId
                tokenId
                blockTimestamp
                transactionHash
              }
            }`
          }),
        });

        if (!vaultResponse.ok || !achievementResponse.ok) {
          throw new Error(`HTTP error! status: ${vaultResponse.status} or ${achievementResponse.status}`);
        }

        const vaultData = await vaultResponse.json();
        const achievementData = await achievementResponse.json();
        console.log(achievementData);
        
        if (vaultData.errors) {
          throw new Error(vaultData.errors[0].message);
        }
        if (achievementData.errors) {
          throw new Error(achievementData.errors[0].message);
        }

        const vaultedFlowersData: VaultedFlower[] = vaultData.data.plantVaulteds.map((flower: any) => ({
          tokenId: flower.tokenId,
          blockTimestamp: flower.blockTimestamp,
          transactionHash: flower.transactionHash,
        }));

        const achievementsData: Achievement[] = achievementData.data.achievementUnlockeds.map((achievement: any) => ({
          achievementId: achievement.achievementId,
          tokenId: achievement.tokenId,
          blockTimestamp: achievement.blockTimestamp,
          transactionHash: achievement.transactionHash,
        }));

        setVaultedFlowers(vaultedFlowersData);
        setAchievements(achievementsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch vault data');
        console.error('Vault fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchVaultData();
  }, [address]);

  const isAchievementUnlocked = (achievementId: string) => {
    return achievements.some(achievement => achievement.achievementId.toString() === achievementId);
  };

  if (!address) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <div className="text-[var(--app-foreground-muted)] mb-2">Connect your wallet to view your vault</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-[var(--app-foreground-muted)]">Loading your vault...</div>
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
    <div className="space-y-6">
      {/* Achievements Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-2">Achievements</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = isAchievementUnlocked(achievement.id);
            return (
              <div 
                key={achievement.id}
                className={`bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] p-4 text-center transition-all ${
                  unlocked 
                    ? 'opacity-100 shadow-md' 
                    : 'opacity-50 grayscale'
                }`}
              >
                <div className={`text-3xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className={`font-medium text-sm mb-1 ${
                  unlocked 
                    ? 'text-[var(--app-foreground)]' 
                    : 'text-[var(--app-foreground-muted)]'
                }`}>
                  {achievement.name}
                </div>
                <div className="text-xs text-[var(--app-foreground-muted)]">
                  {achievement.description}
                </div>
                {unlocked && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Unlocked
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vaulted Flowers Section */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">Your Vault</h2>
          <p className="text-[var(--app-foreground-muted)]">
            {vaultedFlowers.length === 0 
              ? "No vaulted flowers yet" 
              : `${vaultedFlowers.length} vaulted flower${vaultedFlowers.length === 1 ? '' : 's'}`
            }
          </p>
        </div>

        {vaultedFlowers.length === 0 ? (
          <div className="bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] p-8 text-center">
            <div className="text-[var(--app-foreground-muted)] mb-4">
              🌱 Your vault is empty
            </div>
            <div className="text-sm text-[var(--app-foreground-muted)]">
              Grow and vault some flowers to see them here!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaultedFlowers.map((flower) => (
              <div 
                key={flower.tokenId} 
                className="bg-[var(--app-card-bg)] rounded-lg border border-[var(--app-card-border)] p-4 hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <RenderFlower 
                    contractAddress={process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS || ''} 
                    tokenId={flower.tokenId}
                    refreshKey={0}
                  />
                  <div className="mt-2 space-y-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       Vaulted (#{flower.tokenId})
                    </span>
                    <div className="text-xs text-[var(--app-foreground-muted)]">
                      {new Date(Number(flower.blockTimestamp) * 1000).toLocaleDateString()}
                    </div>
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

export default Vault;
