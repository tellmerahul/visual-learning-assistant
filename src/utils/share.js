export async function copyText(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareText(title, text) {
  if (!text) return { ok: false, method: null };
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return { ok: true, method: 'share' };
    } catch (err) {
      if (err?.name === 'AbortError') return { ok: false, method: 'share' };
    }
  }
  const copied = await copyText(text);
  return { ok: copied, method: copied ? 'copy' : null };
}