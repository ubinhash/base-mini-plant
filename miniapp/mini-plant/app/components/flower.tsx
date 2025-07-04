import React, { useState, useEffect } from 'react';
import { generateFlowerSVG } from './genflower.js';
import { NFTCard } from '@coinbase/onchainkit/nft'; 
import RenderFlower from './renderflower';
import { ethers } from 'ethers';
import { useAccount } from "wagmi";
import { useCallback } from 'react';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction'; 

import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionToastAction,
  TransactionResponse,
} from "@coinbase/onchainkit/transaction";

const ERC721_ABI = [
  'function activePlant(address) view returns (uint256)',
  'function mint() payable',
  'function grow() payable',
  'function trimPetal()',
  'function vault()'
];

// Function selectors
const MINT_SELECTOR = '0x1249c58b'; // mint()
const GROW_SELECTOR = '0x5298948e'; // grow()
const TRIM_SELECTOR = '0x48f2e43b'; // trimPetal()
const VAULT_SELECTOR = '0xfbfa77cf'; // vault()

const contractAddress = process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS as `0x${string}`;

export default function FlowerRenderer() {
  const { address } = useAccount();
  
  const [petalCount, setPetalCount] = useState(0);
  const [currentFlowerId, setCurrentFlowerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [buttonKey, setButtonKey] = useState(0);

  useEffect(() => {
    async function fetchActivePlant() {
      if (!address || !process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS) return;
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_URL);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS,
        ERC721_ABI,
        provider
      );
      const flowerId = await contract.activePlant(address);
      if (flowerId && flowerId.toString() !== '0') {
        setCurrentFlowerId(flowerId.toString());
      } else {
        setCurrentFlowerId(null);
      }
    }
    fetchActivePlant();
  }, [address]);

  const refreshFlower = async () => {
    if (!address || !process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS) return;
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_URL);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS,
      ERC721_ABI,
      provider
    );
    const flowerId = await contract.activePlant(address);
    if (flowerId && flowerId.toString() !== '0') {
      setCurrentFlowerId(flowerId.toString());
    } else {
      setCurrentFlowerId(null);
    }
    // Increment refresh key to force re-render of RenderFlower
    setRefreshKey(prev => prev + 1);
  };

  const addPetal = () => {
    setPetalCount(p => Math.min(8, p + 1));
  };

  // Mint, Grow, Trim, Vault handlers
  async function handleMint(response: TransactionResponse) {
    setErrorText(null);
    const transactionHash = response.transactionReceipts[0].transactionHash;
    console.log(`Mint successful: ${transactionHash}`);
    // Refresh the active plant
    if (address) {
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_URL);
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS!,
        ERC721_ABI,
        provider
      );
      const flowerId = await contract.activePlant(address);
      if (flowerId && flowerId.toString() !== '0') {
        setCurrentFlowerId(flowerId.toString());
      }
    }
  }

  const handleGrow = async (response: TransactionResponse) => {
    console.log("handleGrow");
    setErrorText(null);
    const transactionHash = response.transactionReceipts[0].transactionHash;
    console.log(`Grow successful: ${transactionHash}`);
    setTimeout(() => {
      refreshFlower();
    }, 1000);
    setButtonKey(prev => prev + 1); // Force re-render
  };

  async function handleTrim(response: TransactionResponse) {
    setErrorText(null);
    const transactionHash = response.transactionReceipts[0].transactionHash;
    console.log(`Trim successful: ${transactionHash}`);
    setButtonKey(prev => prev + 1);
  }

  async function handleVault(response: TransactionResponse) {
    setErrorText(null);
    const transactionHash = response.transactionReceipts[0].transactionHash;
    console.log(`Vault successful: ${transactionHash}`);
    // Clear active plant after vaulting
    setCurrentFlowerId(null);
    setButtonKey(prev => prev + 1);
  }

  const handleOnStatus = useCallback((status: LifecycleStatus) => {  
    console.log('Transaction status:', status); 
  }, []); 

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--app-foreground)] mb-2">Base Mini Plant</h1>
        <p className="text-[var(--app-foreground-muted)]">Grow your fully-onchain plant</p>
      </div>
      
      {/* <div 
        key={petalCount} 
        dangerouslySetInnerHTML={{ __html: generateFlowerSVG(petalCount) }} 
      />
          <button onClick={addPetal} disabled={petalCount >= 8}>
        Add Petal
      </button> */}

      {address && currentFlowerId && (
        <div>
          <RenderFlower 
            key={refreshKey}
            contractAddress={process.env.NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS || ''} 
            tokenId={currentFlowerId} 
            refreshKey={refreshKey}
          />
           <button 
            onClick={refreshFlower}
            style={{ 
              marginTop: '8px', 
              padding: '8px 16px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Refresh Flower
          </button>
       
        </div>
      )}
        
     
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '16px 0' }}>
        {!currentFlowerId && (
          <Transaction
            calls={[
              {
                to: contractAddress,
                value: BigInt(ethers.parseEther("0.00001").toString()),
                data: MINT_SELECTOR,
              },
            ]}
            onSuccess={handleMint}
            onError={(e) => {
              setErrorText(e.message || String(e));
            }}
          >
            <TransactionButton className="text-white text-md" text="Mint"/>
            <TransactionStatus>
              <TransactionStatusAction />
              <TransactionStatusLabel />
            </TransactionStatus>
            <TransactionToast>
              <TransactionToastIcon />
              <TransactionToastLabel />
              <TransactionToastAction />
            </TransactionToast>
          </Transaction>
        )}
        {currentFlowerId && (
          <>
            <Transaction
              key={buttonKey}
              calls={[
                {
                  to: contractAddress,
                  value: BigInt(ethers.parseEther("0.0000005").toString()),
                  data: GROW_SELECTOR,
                },
              ]}
              onSuccess={handleGrow}
              onError={(e) => {
                setErrorText(e.message || String(e));
              }}
              onStatus={handleOnStatus}
            >
              <TransactionButton className="text-white text-md" text="Grow"/>
              <TransactionToast>
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
            <Transaction
              key={buttonKey + 1}
              calls={[
                {
                  to: contractAddress,
                  data: TRIM_SELECTOR,
                },
              ]}
              onSuccess={handleTrim}
              onError={(e) => {
                setErrorText(e.message || String(e));
              }}
            >
              <TransactionButton className="text-white text-md" text="Trim"/>
              <TransactionToast>
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
            <Transaction
              key={buttonKey + 2}
              calls={[
                {
                  to: contractAddress,
                  data: VAULT_SELECTOR,
                },
              ]}
              onSuccess={handleVault}
              onError={(e) => {
                setErrorText(e.message || String(e));
              }}
            >
              <TransactionButton className="text-white text-md" text="Vault"/>
              <TransactionToast>
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
          </>
        )}
      </div>
      {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
      {currentFlowerId && <div>Flower ID: {currentFlowerId}</div>}
      {/* {address && <div>Address: {address}</div>} */}
   
    </div>
  );
}
