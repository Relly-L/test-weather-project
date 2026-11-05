export type Coords = { latitude: number; longitude: number };

/** Browser Geolocation API. Rejects on denial, timeout or missing support. */
export function getBrowserPosition(timeoutMs = 8000): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("geolocation-unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
      (e) => reject(new Error(`geolocation-${e.code}`)),
      { timeout: timeoutMs, maximumAge: 10 * 60 * 1000 },
    );
  });
}

/** Approximate position by IP. The user's IP is sent to ipwho.is. */
export async function getIpPosition(signal?: AbortSignal): Promise<Coords> {
  const res = await fetch("https://ipwho.is/?fields=success,latitude,longitude", { signal });
  if (!res.ok) throw new Error(`ip-lookup-${res.status}`);
  const data = (await res.json()) as { success?: boolean; latitude?: number; longitude?: number };
  if (!data.success || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
    throw new Error("ip-lookup-failed");
  }
  return { latitude: data.latitude, longitude: data.longitude };
}
