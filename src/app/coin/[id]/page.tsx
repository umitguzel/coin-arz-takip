"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CoinDetailPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinDetail = async () => {
      try {
        const response = await axios.get(`https://localhost:7294/api/coins/${id}`);
        setCoin(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Detay verisi alınamadı:", error);
      }
    };

    fetchCoinDetail();
  }, [id]);

  if (loading) return <p className="p-6">Yükleniyor...</p>;

  const latestSupply =
    parseFloat(coin.history?.at(-1)?.circulatingSupply || coin.totalSupply || "0");

  const chartData = {
    labels: coin.history.map((entry: any) => entry.date),
    datasets: [
      {
        label: "Dolaşımdaki Arz",
        data: coin.history.map((entry: any) => parseFloat(entry.circulatingSupply)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 1.5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Dolaşımdaki Arz (Son 60 Gün)",
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => value.toLocaleString("tr-TR")
        }
      }
    }
  };

  return (
    <main className="p-6 bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <img src={coin.logoUrl} alt={coin.name} className="w-12 h-12" />
        <h1 className="text-3xl font-bold text-gray-800">
          {coin.name} ({coin.symbol})
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-8 text-sm bg-white p-4 rounded shadow">
        <div><strong>Toplam Arz:</strong> {parseFloat(coin.totalSupply).toLocaleString("tr-TR")}</div>
        <div><strong>Maksimum Arz:</strong> {parseFloat(coin.maxSupply).toLocaleString("tr-TR")}</div>
        <div><strong>Dolaşımdaki Arz:</strong> {latestSupply.toLocaleString("tr-TR")}</div>
        <div><strong>Son Güncelleme:</strong> {coin.history?.at(-1)?.date}</div>
      </div>

      <div className="mb-8 bg-white p-6 rounded shadow">
        <Line data={chartData} options={chartOptions} />
      </div>

      <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline text-sm">
        ← Ana Sayfaya Dön
      </Link>
    </main>
  );
}
