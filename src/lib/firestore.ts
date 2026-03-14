import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Asset, Portfolio } from '../types';
import Decimal from 'decimal.js';

function parseAsset(data: any, id: string): Asset {
  return {
    id,
    symbol: data.symbol,
    name: data.name,
    assetClass: data.assetClass,
    quantity: new Decimal(data.quantity),
    buyPrice: new Decimal(data.buyPrice),
    currentPrice: new Decimal(data.currentPrice || 0),
    addedAt: data.addedAt,
  };
}

export async function createPortfolio(userId: string, name: string): Promise<string> {
  const portfolioRef = doc(collection(db, `users/${userId}/portfolios`));
  await setDoc(portfolioRef, {
    name,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  return portfolioRef.id;
}

export async function getPortfolios(userId: string): Promise<Portfolio[]> {
  const portfoliosSnapshot = await getDocs(collection(db, `users/${userId}/portfolios`));
  const portfolios: Portfolio[] = [];

  for (const pDoc of portfoliosSnapshot.docs) {
    const pData = pDoc.data();
    const assetsSnapshot = await getDocs(collection(db, `users/${userId}/portfolios/${pDoc.id}/assets`));
    
    const assets: Asset[] = assetsSnapshot.docs.map(aDoc => parseAsset(aDoc.data(), aDoc.id));

    portfolios.push({
      id: pDoc.id,
      userId,
      name: pData.name,
      assets,
      createdAt: pData.createdAt,
      updatedAt: pData.updatedAt
    });
  }

  return portfolios;
}

export async function addAsset(userId: string, portfolioId: string, asset: Omit<Asset, 'id'>): Promise<void> {
  const assetRef = doc(collection(db, `users/${userId}/portfolios/${portfolioId}/assets`));
  await setDoc(assetRef, {
    symbol: asset.symbol,
    name: asset.name,
    assetClass: asset.assetClass,
    quantity: asset.quantity.toString(),
    buyPrice: asset.buyPrice.toString(),
    currentPrice: asset.currentPrice.toString(),
    addedAt: asset.addedAt
  });
  
  await updateDoc(doc(db, `users/${userId}/portfolios/${portfolioId}`), {
    updatedAt: Date.now()
  });
}

export async function removeAsset(userId: string, portfolioId: string, assetId: string): Promise<void> {
  await deleteDoc(doc(db, `users/${userId}/portfolios/${portfolioId}/assets/${assetId}`));
  await updateDoc(doc(db, `users/${userId}/portfolios/${portfolioId}`), {
    updatedAt: Date.now()
  });
}

export async function updateAsset(userId: string, portfolioId: string, assetId: string, updates: Partial<Asset>): Promise<void> {
  const updateData: any = {};
  if (updates.quantity) updateData.quantity = updates.quantity.toString();
  if (updates.buyPrice) updateData.buyPrice = updates.buyPrice.toString();
  if (updates.currentPrice) updateData.currentPrice = updates.currentPrice.toString();
  
  await updateDoc(doc(db, `users/${userId}/portfolios/${portfolioId}/assets/${assetId}`), updateData);
  await updateDoc(doc(db, `users/${userId}/portfolios/${portfolioId}`), {
    updatedAt: Date.now()
  });
}
