// Servidor estático local sem dependências. Uso: node servir.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end('Requisição inválida'); return; }
  if (name === '/') name = '/index.html';
  const file = path.resolve(root, '.' + name);
  const relative = path.relative(root, file);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).some(p => p.startsWith('.'))) { res.writeHead(403); res.end('Acesso negado'); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Arquivo não encontrado'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(data);
  });
});
server.listen(8080, '127.0.0.1', () => console.log('Perboni FLV: http://127.0.0.1:8080 — Ctrl+C para encerrar.'));
server.on('error', err => { console.error(err.message); process.exitCode = 1; });
