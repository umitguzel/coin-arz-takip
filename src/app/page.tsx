"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get("https://localhost:7294/api/coins");
        setCoins(response.data);
        setLastUpdate(new Date().toLocaleString("tr-TR"));
      } catch (error) {
        console.error("API'den veri çekilemedi:", error);
      }
    };

    fetchCoins();
  }, []);

  const filteredCoins = coins.filter((coin: any) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">Coin Arz Takip Sistemi</h1>
      <p className="text-center text-sm text-gray-600 mb-6">
        Son güncelleme: {lastUpdate}
      </p>
      <input
        type="text"
        placeholder="Coin ismiyle ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block mx-auto mb-6 p-2 border border-gray-300 rounded w-full max-w-md shadow-sm"
      />

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Coin</th>
              <th className="px-4 py-2">Sembol</th>
              <th className="px-4 py-2">Dolaşımdaki Arz</th>
              <th className="px-4 py-2">Toplam Arz</th>
              <th className="px-4 py-2">Maksimum Arz</th>
              <th className="px-4 py-2">Son Arz</th>
              <th className="px-4 py-2">Son Güncelleme</th>
              <th className="px-4 py-2">Önceki Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin: any, index: number) => (
              <tr key={coin.symbol} className="bg-white border-b hover:bg-gray-100">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={coin.logoUrl} alt={coin.name} className="w-5 h-5" />
                  <Link
                    href={`/coin/${coin.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {coin.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-center">{coin.symbol}</td>
                <td className="px-4 py-2 text-right">{coin.circulatingSupply?.toLocaleString("tr-TR")}</td>
                <td className="px-4 py-2 text-right">{coin.totalSupply?.toLocaleString("tr-TR")}</td>
                <td className="px-4 py-2 text-right">{coin.maxSupply?.toLocaleString("tr-TR") || "-"}</td>
                <td className="px-4 py-2 text-right">{coin.latestSupply?.toLocaleString("tr-TR")}</td>
                <td className="px-4 py-2 text-center">{new Date(coin.lastUpdate).toLocaleString("tr-TR")}</td>
                <td className="px-4 py-2 text-center">{new Date(coin.previousUpdate).toLocaleString("tr-TR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
