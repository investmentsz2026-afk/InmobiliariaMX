import { GET } from "../src/app/api/grill/route";
import { NextRequest } from "next/server";

async function main() {
  const req = new NextRequest("http://localhost:3000/api/grill");
  const res = await GET(req);
  const data = await res.json();
  console.log("API returned:", JSON.stringify(data, null, 2));
}

main().catch(console.error);
