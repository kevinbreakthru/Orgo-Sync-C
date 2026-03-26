"use client";

import { RoleGate } from "../../lib/role-context";
import { Smartphone, Wifi } from "lucide-react";

function QRCodeSVG() {
  // Static 21x21 QR code pattern representing a demo URL
  const modules = [
    "111111100110001111111",
    "100000101100001000001",
    "101110100001101011101",
    "101110101110001011101",
    "101110100011101011101",
    "100000101010101000001",
    "111111101010101111111",
    "000000001110100000000",
    "110011111001011001100",
    "011010010110001110010",
    "001111110010110011101",
    "010100001101010100110",
    "110011101010001011001",
    "000000001011010100010",
    "111111100010101010101",
    "100000100110010001100",
    "101110101001011011111",
    "101110100100100110010",
    "101110101010011001101",
    "100000101100110100010",
    "111111101001001011101",
  ];

  const size = 140;
  const cellSize = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" rx="4" />
      {modules.map((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0D0D0D"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function PlatformQRCard() {
  return (
    <RoleGate allow={["platform"]}>
      <div className="dark-card rounded-2xl border border-neutral-800/60 p-6 mt-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative shrink-0">
            <div className="rounded-xl p-1 bg-gradient-to-br from-brand-500/20 to-transparent">
              <QRCodeSVG />
            </div>
            <div className="absolute -top-2 -right-2 rounded-full bg-success p-1.5">
              <Wifi size={10} className="text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={16} className="text-brand-500" strokeWidth={1.75} />
              <h3 className="text-heading-4 text-white">Real-Time Calendar Link</h3>
            </div>
            <p className="text-body-sm text-neutral-400 leading-relaxed mb-3">
              Scan to see schedule updates hit a device in real-time. This proves that data
              published through Orgo Sync reaches consumers within seconds.
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-neutral-800/80 text-brand-400 px-3 py-1.5 rounded-md font-mono tracking-wide">
                orgosync://cal/live/teamsnap-xyz
              </code>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
