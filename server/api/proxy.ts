export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;
  const type = query.type as string;

  if (!url || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing "url" or "type" query parameter',
    });
  }

  // Validate type
  if (!["video", "subtitle"].includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid type, must be "video" or "subtitle"',
    });
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      statusMessage: `Failed to fetch: ${res.statusText}`,
    });
  }

  // Stream the content directly back to the client
  const contentType =
    res.headers.get("content-type") || "application/octet-stream";
  setHeader(event, "Content-Type", contentType);

  const body = res.body;
  if (body) {
    return sendStream(event, body);
  }

  return "";
});
