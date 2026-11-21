export interface UploadProgressEvent {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  listingId?: string;
  folderId?: string;
  altText?: string;
  onProgress?: (progress: UploadProgressEvent) => void;
}

export interface UploadResult {
  id: string;
  key: string;
  url: string;
  altText: string | null;
  mimeType: string;
  bytes: number;
}

/**
 * High-performance, client-side direct media uploader supporting progress feedback.
 * Works seamlessly with both Cloudflare R2 / S3 presigned URLs and local dev disks.
 */
export async function uploadMediaFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // Step 1: Request upload ticket
  const ticketRes = await fetch("/api/media/upload-ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type || "image/jpeg",
      bytes: file.size,
      listingId: options.listingId,
      folderId: options.folderId,
      altText: options.altText || file.name,
    }),
  });

  if (!ticketRes.ok) {
    const errData = await ticketRes.json().catch(() => ({}));
    throw new Error(errData.error || `Upload ticket failed with status ${ticketRes.status}`);
  }

  const { ticket } = await ticketRes.json();

  // Step 2: Upload file bytes directly via XMLHttpRequest for fine-grained progress
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(ticket.method || "POST", ticket.uploadUrl);

    if (ticket.headers) {
      for (const [header, val] of Object.entries(ticket.headers)) {
        xhr.setRequestHeader(header, val as string);
      }
    }

    if (xhr.upload && options.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          options.onProgress?.({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.min(100, Math.round((event.loaded / event.total) * 100)),
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        options.onProgress?.({ loaded: file.size, total: file.size, percentage: 100 });
        resolve();
      } else {
        reject(new Error(`Storage transfer failed with status ${xhr.status}: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network failure during media upload."));
    xhr.send(file);
  });

  // Step 3: Confirm upload and persist database record
  const confirmRes = await fetch("/api/media/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: ticket.key,
      url: ticket.publicUrl,
      mimeType: file.type || "image/jpeg",
      bytes: file.size,
      fileName: file.name,
      listingId: options.listingId,
      folderId: options.folderId,
      altText: options.altText || file.name,
    }),
  });

  if (!confirmRes.ok) {
    const errData = await confirmRes.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to confirm media upload in database.");
  }

  const { media } = await confirmRes.json();
  return media;
}
