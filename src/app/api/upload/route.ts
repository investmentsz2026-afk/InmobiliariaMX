import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  // Guard clause to ensure only authenticated users upload images
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se subieron archivos" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    // Ensure the uploads folder exists inside public
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize name and create unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      let fileExtension = cleanOriginalName.split(".").pop()?.toLowerCase() || "";

      // Fallback mapping based on MIME type if extension is missing/non-standard
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/svg+xml": "svg",
        "video/mp4": "mp4",
        "video/webm": "webm",
        "video/quicktime": "mov",
        "video/x-msvideo": "avi",
        "video/ogg": "ogg",
      };

      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "mov", "avi", "ogg", "mkv"];

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        if (file.type && mimeToExt[file.type]) {
          fileExtension = mimeToExt[file.type];
        } else if (file.type && file.type.startsWith("video/")) {
          fileExtension = "mp4";
        } else {
          fileExtension = "jpg"; // Default fallback
        }
      }

      const filename = `${uniqueSuffix}.${fileExtension}`;
      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Fallo en la subida de imágenes" }, { status: 500 });
  }
}
