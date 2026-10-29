/**
 * Coursue Admin Utilities
 * Helper functions for YouTube video extraction, slug generation, duration conversions, and category labels.
 */

/**
 * Extracts and validates YouTube video ID from various standard YouTube URL formats.
 * Supported formats:
 * - Direct 11-character video ID: e.g. "kUMe1FH4CHE"
 * - Standard watch URL: "https://www.youtube.com/watch?v=kUMe1FH4CHE" (with optional parameters like &t=10s)
 * - Shortened share URL: "https://youtu.be/kUMe1FH4CHE?si=xyz"
 * - Embed URL: "https://www.youtube.com/embed/kUMe1FH4CHE"
 * - Shorts URL: "https://www.youtube.com/shorts/kUMe1FH4CHE"
 * - Mobile URL: "https://m.youtube.com/watch?v=kUMe1FH4CHE"
 */
export function extractYouTubeVideoId(urlOrId: string): {
  videoId: string | null;
  isValid: boolean;
  normalizedUrl: string | null;
} {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return { videoId: null, isValid: false, normalizedUrl: null };
  }

  const trimmed = urlOrId.trim();

  // Case 1: Direct 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      videoId: trimmed,
      isValid: true,
      normalizedUrl: `https://www.youtube.com/watch?v=${trimmed}`,
    };
  }

  // Case 2: URL parsing
  // Matches:
  // - youtube.com/watch?v=ID
  // - youtube.com/embed/ID
  // - youtube.com/v/ID
  // - youtube.com/shorts/ID
  // - youtu.be/ID
  const patterns = [
    /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(?:watch\?.*?v=|embed\/|v\/|shorts\/)([a-zA-Z0-9_-]{11})/i,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      const videoId = match[1];
      return {
        videoId,
        isValid: true,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    }
  }

  return { videoId: null, isValid: false, normalizedUrl: null };
}

/**
 * Generates a clean, URL-friendly slug from a course title.
 * e.g., "Full-Stack Web Development 2026!" -> "full-stack-web-development-2026"
 */
export function generateSlug(title: string): string {
  if (!title) return '';

  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except space and hyphen
    .trim()
    .replace(/[\s_]+/g, '-') // replace space and underscore with hyphen
    .replace(/-+/g, '-'); // collapse multiple hyphens
}

/**
 * Returns human-readable label for course categories.
 */
export function getCategoryLabel(category: string): string {
  switch (category.toLowerCase()) {
    case 'frontend':
      return 'Front End';
    case 'design':
      return 'UI/UX Design';
    case 'branding':
      return 'Branding';
    case 'mobile':
      return 'Mobile Dev';
    case 'devops':
      return 'DevOps';
    case 'general':
      return 'General';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

/**
 * Formats duration in seconds to "Xm" or "Xh Ym" or "MM:SS"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 min';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hrs > 0) {
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }
  return `${mins}m`;
}

