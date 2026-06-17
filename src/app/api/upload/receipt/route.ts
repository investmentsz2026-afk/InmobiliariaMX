import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se subieron archivos" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate it's an image
      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Solo se permiten imágenes como comprobante de pago." }, { status: 400 });
      }

      // Limit size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "El comprobante excede el tamaño máximo permitido de 10MB." }, { status: 400 });
      }

      // Sanitize name and create unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      let fileExtension = cleanOriginalName.split(".").pop()?.toLowerCase() || "";

      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
      };

      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        if (file.type && mimeToExt[file.type]) {
          fileExtension = mimeToExt[file.type];
        } else {
          fileExtension = "jpg"; // Default fallback
        }
      }

      const filename = `receipts/${uniqueSuffix}.${fileExtension}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
        addRandomSuffix: false,
      });

      uploadedUrls.push(blob.url);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error: any) {
    console.error("Receipt upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Fallo en la subida del comprobante" },
      { status: 500 }
    );
  }
}
