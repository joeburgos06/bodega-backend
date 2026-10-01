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
  { id: 1, nombre: 'Inca Kola 500ml', precio: 3.50, stock: 24, categoria: 'Bebidas' },
  { id: 2, nombre: 'Galletas Casino', precio: 1.80, stock: 20, categoria: 'Snacks' }
];

// --- ENDPOINTS REST PARA ANDROID ---
app.get('/api/productos', (req, res) => {
  res.json(productos);
});

app.post('/api/productos', (req, res) => {
  const items = req.body;
  if (Array.isArray(items)) {
    items.forEach(prod => {
      const idx = productos.findIndex(p => p.id === prod.id);
      if (idx !== -1) {
        productos[idx] = prod;
      } else {
        productos.push({ ...prod, id: productos.length + 1 });
      }
    });
    return res.status(201).json({ mensaje: 'Sincronizado' });
  }
  productos.push({ id: productos.length + 1, ...items });
  res.status(201).json({ mensaje: 'Guardado' });
});

// --- PORTAL WEB ADMINISTRATIVO ---
app.get('/', (req, res) => {
  const idEdit = parseInt(req.query.edit);
  const prodEdit = productos.find(p => p.id === idEdit);

  let filasCat = '';
  for (const c of categorias) {
    filasCat += '«tr»' +
      '«td»' + c.id + '«/td»' +
      '«td»' + c.nombre + '«/td»' +
      '«td»«a href="/del-cat/' + c.id + '" class="btn btn-sm btn-danger"»Borrar«/a»«/td»' +
      '«/tr»';
  }

  let filasProd = '';
  for (const p of productos) {
    filasProd += '«tr»' +
      '«td»' + p.id + '«/td»' +
      '«td»' + p.nombre + '«/td»' +
      '«td»S/ ' + Number(p.precio).toFixed(2) + '«/td»' +
      '«td»' + p.stock + '«/td»' +
      '«td»' + p.categoria + '«/td»' +
      '«td»' +
      '«a href="/?edit=' + p.id + '" class="btn btn-sm btn-warning me-1"»Editar«/a»' +
      '«a href="/del-prod/' + p.id + '" class="btn btn-sm btn-danger"»Borrar«/a»' +
      '«/td»' +
      '«/tr»';
  }

  const tituloForm = prodEdit ? ('Editar Producto (ID: ' + prodEdit.id + ')') : 'Registrar Producto';
  const colorHeader = prodEdit ? 'bg-warning text-dark' : 'bg-success text-white';
  const accionForm = prodEdit ? '/update-prod' : '/add-prod';
  const inputId = prodEdit ? ('«input type="hidden" name="id" value="' + prodEdit.id + '"»') : '';
  const valNom = prodEdit ? prodEdit.nombre : '';
  const valPre = prodEdit ? prodEdit.precio : '';
  const valStk = prodEdit ? prodEdit.stock : '';
  const valCat = prodEdit ? prodEdit.categoria : '';
  const btnTxt = prodEdit ? 'Actualizar Cambios' : 'Guardar Producto';
  const btnColor = prodEdit ? 'btn-warning' : 'btn-success';
  const btnCancel = prodEdit ? '«a href="/" class="btn btn-secondary w-100 mt-2"»Cancelar Edición«/a»' : '';

  const plantilla = [
    '«!DOCTYPE html»',
    '«html lang="es"»',
    '«head»',
    '  «meta charset="utf-8"»',
    '  «title»Bodega Admin«/title»',
    '  «link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"»',
    '«/head»',
    '«body class="container py-4"»',
    '  «h2 class="mb-4"»Portal Administrativo - Control de Inventario«/h2»',
    '  «div class="row"»',
    '    «div class="col-md-4"»',
    '      «div class="card mb-4 shadow-sm"»',
    '        «div class="card-header bg-primary text-white"»Registrar Categoría«/div»',
    '        «div class="card-body"»',
    '          «form action="/add-cat" method="POST"»',
    '            «input name="nombre" class="form-control mb-2" placeholder="Nueva categoría" required»',
    '            «button class="btn btn-primary w-100"»Guardar Categoría«/button»',
    '          «/form»',
    '        «/div»',
    '      «/div»',
    '      «table class="table table-bordered table-striped"»',
    '        «thead class="table-light"»«tr»«th»ID«/th»«th»Nombre«/th»«th»Acción«/th»«/tr»«/thead»',
    '        «tbody»' + filasCat + '«/tbody»',
    '      «/table»',
    '    «/div»',
    '    «div class="col-md-8"»',
    '      «div class="card mb-4 shadow-sm"»',
    '        «div class="card-header ' + colorHeader + '"»' + tituloForm + '«/div»',
    '        «div class="card-body"»',
    '          «form action="' + accionForm + '" method="POST" class="row g-2"»',
    '            ' + inputId,
    '            «div class="col-md-4"»«input name="nombre" class="form-control" placeholder="Nombre" value="' + valNom + '" required»«/div»',
    '            «div class="col-md-3"»«input type="number" step="0.1" name="precio" class="form-control" placeholder="Precio" value="' + valPre + '" required»«/div»',
    '            «div class="col-md-2"»«input type="number" name="stock" class="form-control" placeholder="Stock" value="' + valStk + '" required»«/div»',
    '            «div class="col-md-3"»«input name="categoria" class="form-control" placeholder="Categoría" value="' + valCat + '" required»«/div»',
    '            «div class="col-12 mt-3"»',
    '              «button class="btn ' + btnColor + ' w-100"»' + btnTxt + '«/button»',
    '              ' + btnCancel,
    '            «/div»',
    '          «/form»',
    '        «/div»',
    '      «/div»',
    '      «table class="table table-bordered table-striped"»',
    '        «thead class="table-light"»',
    '          «tr»«th»ID«/th»«th»Nombre«/th»«th»Precio«/th»«th»Stock«/th»«th»Categoría«/th»«th»Acción«/th»«/tr»',
    '        «/thead»',
    '        «tbody»' + filasProd + '«/tbody»',
    '      «/table»',
    '    «/div»',
    '  «/div»',
    '«/body»',
    '«/html»'
  ].join('\n');

  const htmlFinal = plantilla
    .replace(/«/g, String.fromCharCode(60))
    .replace(/»/g, String.fromCharCode(62));

  res.send(htmlFinal);
});

// --- ACCIONES DEL PORTAL WEB ---
app.post('/add-prod', (req, res) => {
  const { nombre, precio, stock, categoria } = req.body;
  productos.push({
    id: productos.length + 1,
    nombre: nombre,
    precio: parseFloat(precio),
    stock: parseInt(stock),
    categoria: categoria
  });
  res.redirect('/');
});

app.post('/update-prod', (req, res) => {
  const { id, nombre, precio, stock, categoria } = req.body;
  const idx = productos.findIndex(p => p.id === parseInt(id));
  if (idx !== -1) {
    productos[idx] = {
      id: parseInt(id),
      nombre: nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria: categoria
    };
  }
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
app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
