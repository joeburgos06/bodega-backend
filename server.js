const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let categorias = [
  { id: 1, nombre: 'Bebidas' },
  { id: 2, nombre: 'Snacks' }
];

let productos = [
  { id: 1, nombre: 'Inca Kola 500ml', precio: 3.50, stock: 24, categoria: 'Bebidas' }
];

// Rutas de API para Android
app.get('/api/productos', (req, res) => res.json(productos));

app.post('/api/productos', (req, res) => {
  const items = req.body;
  if (Array.isArray(items)) {
    items.forEach(prod => {
      const idx = productos.findIndex(p => p.id === prod.id);
      if (idx >= 0) productos[idx] = prod;
      else productos.push({ ...prod, id: productos.length + 1 });
    });
    return res.status(201).json({ mensaje: 'Sincronizado' });
  }
  productos.push({ id: productos.length + 1, ...items });
  res.status(201).json({ mensaje: 'Guardado' });
});

// Portal Web Administrativo
app.get('/', (req, res) => {
  const filasProd = productos.map(p => `
    <tr><td>${p.id}</td><td>${p.nombre}</td><td>S/ ${Number(p.precio).toFixed(2)}</td><td>${p.stock}</td><td>${p.categoria}</td>
    <td><a href="/del-prod/${p.id}" class="btn btn-sm btn-danger">Borrar</a></td></tr>`).join('');
  const filasCat = categorias.map(c => `
    <tr><td>${c.id}</td><td>${c.nombre}</td><td><a href="/del-cat/${c.id}" class="btn btn-sm btn-danger">Borrar</a></td></tr>`).join('');

  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bodega Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"></head>
    <body class="container py-4"><h2>Portal Administrativo - Bodega</h2><div class="row">
    <div class="col-md-4"><h4>Categorías</h4><form action="/add-cat" method="POST" class="mb-3">
    <input name="nombre" class="form-control mb-2" placeholder="Nueva categoría" required>
    <button class="btn btn-primary w-100">Guardar</button></form>
    <table class="table table-bordered"><tbody>${filasCat}</tbody></table></div>
    <div class="col-md-8"><h4>Productos</h4><form action="/add-prod" method="POST" class="row g-2 mb-3">
    <div class="col-4"><input name="nombre" class="form-control" placeholder="Nombre" required></div>
    <div class="col-3"><input type="number" step="0.1" name="precio" class="form-control" placeholder="Precio" required></div>
    <div class="col-2"><input type="number" name="stock" class="form-control" placeholder="Stock" required></div>
    <div class="col-3"><input name="categoria" class="form-control" placeholder="Categoría" required></div>
    <div class="col-12"><button class="btn btn-success w-100">Guardar Producto</button></div></form>
    <table class="table table-bordered"><thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Cat</th><th>Acción</th></tr></thead>
    <tbody>${filasProd}</tbody></table></div></div></body></html>`);
});

app.post('/add-prod', (req, res) => {
  const { nombre, precio, stock, categoria } = req.body;
  productos.push({ id: productos.length + 1, nombre, precio: parseFloat(precio), stock: parseInt(stock), categoria });
  res.redirect('/');
});
app.post('/add-cat', (req, res) => {
  categorias.push({ id: categorias.length + 1, nombre: req.body.nombre });
  res.redirect('/');
});
app.get('/del-prod/:id', (req, res) => {
  productos = productos.filter(p => p.id !== parseInt(req.params.id));
  res.redirect('/');
});
app.get('/del-cat/:id', (req, res) => {
  categorias = categorias.filter(c => c.id !== parseInt(req.params.id));
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Servidor listo'));
