import { chains } from "@/lib/constants";
import { NextResponse } from "next/server";
import { createPublicClient, formatUnits, http, parseUnits } from "viem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const chainId = searchParams.get("chainId");

  if (!address || !chainId) {
    return NextResponse.json(
      { error: "Missing address or chainId" },
      { status: 400 }
    );
  }

  try {
    const chain = chains.find((c) => c.id === Number(chainId));
    if (!chain) {
      return NextResponse.json(
        { error: "Invalid chain ID" },
        { status: 400 }
      );
    }

    const client = createPublicClient({
      chain,
      transport: http(),
    });

    const balance = await client.getBalance({
      address: address as `0x${string}`,
    });

    const formatted = formatUnits(balance, 18);

    return NextResponse.json({
      balance: formatted, // Convert BigInt to string
      formatted,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance" },
      { status: 500 }
    );
  }
}
