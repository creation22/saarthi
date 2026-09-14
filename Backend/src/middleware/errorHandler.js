export function errorHandler(err, _req, res, _next) {
  console.error(err);

  // Mongoose validation / cast errors are client errors, not 500s
  if (err?.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid data supplied' });
  }
  if (err?.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid identifier supplied' });
  }
  // Duplicate key (e.g. concurrent creates beating the duplicate check)
  if (err?.code === 11000) {
    return res.status(409).json({ error: 'Already exists' });
  }
  // Multer upload errors (file too large, etc.)
  if (err?.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File too large. Maximum size is 10 MB.'
      : 'File upload failed.';
    return res.status(400).json({ error: message });
  }
  // Body-parser entity-too-large
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }

  const status = Number.isInteger(err?.status) ? err.status : 500;
  // Never leak internal details on 500 — log server-side, return generic message
  const message = status >= 500
    ? 'Internal server error'
    : (err?.message || 'Request failed');
  res.status(status).json({ error: message });
}
