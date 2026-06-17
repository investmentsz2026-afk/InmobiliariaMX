import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  // Guard clause to ensure only authenticated users upload files
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

    for (const file of files) {
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

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
      });

      uploadedUrls.push(blob.url);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Fallo en la subida de archivos. Verifica que BLOB_READ_WRITE_TOKEN esté configurado." },
      { status: 500 }
    );
  }
}
