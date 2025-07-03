import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface RenderFlowerProps {
  contractAddress: string;
  tokenId: string;
  refreshKey: number;
}

const ERC721_ABI = [
  'function tokenURI(uint256 tokenId) view returns (string)',
];

function decodeBase64DataUri(dataUri: string): string {
  // data:image/svg+xml;base64,....
  const base64 = dataUri.split(',')[1];
  return atob(base64);
}

const RenderFlower: React.FC<RenderFlowerProps> = ({ contractAddress, tokenId, refreshKey }) => {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSVG() {
      try {
        if (!window.ethereum) {
          setError('No Ethereum provider found');
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
        const uri: string = await contract.tokenURI(tokenId);
        if (!uri.startsWith('data:application/json;base64,')) {
          setError('Unexpected tokenURI format');
          return;
        }
        const json = JSON.parse(atob(uri.split(',')[1]));
        if (!json.image || !json.image.startsWith('data:image/svg+xml;base64,')) {
          setError('No SVG image found in tokenURI');
          return;
        }
        setSvg(decodeBase64DataUri(json.image));
      } catch (e: any) {
        setError(e.message || 'Error fetching SVG');
      }
    }
    fetchSVG();
  }, [contractAddress, tokenId, refreshKey]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!svg) return <div>Loading...</div>;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div dangerouslySetInnerHTML={{ __html: svg }} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default RenderFlower;
