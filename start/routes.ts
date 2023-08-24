/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  //// authetication route
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
  }).prefix('/auth')

  /// route pour les produit
  Route.group(() => {
    Route.get('/list', 'ProduitsController.list')
    Route.get('/statistique', 'ProduitsController.Statistique')
    Route.get('/getById/:id', 'ProduitsController.listById')
    Route.post('/save', 'ProduitsController.save')
    Route.put('/update/:id', 'ProduitsController.update')
  }).prefix('/produit').middleware(['auth'])

  /// route pour les lot produit
  Route.group(() => {
    Route.get('/list', 'LotProduitsController.list')
    Route.get('/list/state', 'LotProduitsController.listState')
    Route.get('/getById/:id', 'LotProduitsController.listById')
    Route.get('/getByIdProduit/:idProduit', 'LotProduitsController.getByIdProduit')
    Route.get('/getStateVente/:idProduit', 'LotProduitsController.getStateVente')
    Route.post('/save', 'LotProduitsController.save')
    Route.put('/update/:id', 'LotProduitsController.update')
  }).prefix('/produit/lot').middleware(['auth'])


  /// route pour les param vente
  Route.group(() => {
    Route.get('/list', 'ParamVentesController.list')
    Route.get('/getById/:id', 'ParamVentesController.listById')
    Route.get('/getByIdProduit/:idProduit', 'ParamVentesController.getByIdProduit')
    Route.post('/save', 'ParamVentesController.save')
    Route.put('/update/:id', 'ParamVentesController.update')
  }).prefix('/param/vente').middleware(['auth'])

  /// route pour les add vente
  Route.group(() => {
    Route.get('/list', 'AddVentesController.list')
    Route.get('/getByIdProduit/:id_produit', 'AddVentesController.listByIdProduit')
    Route.get('/getByIdUser/:id_user', 'AddVentesController.listByIdUser')
    Route.post('/save', 'AddVentesController.save')
    Route.put('/update/:id', 'AddVentesController.update')
    Route.delete('/deleteByIsUser/:id_user', 'AddVentesController.DeleteByIdUser')
    Route.delete('/delete/:id', 'AddVentesController.DeleteById')
  }).prefix('/add/vente').middleware(['auth'])

  /// route pour les ventes
  Route.group(() => {
    Route.get('/list', 'VentesController.list')
    Route.get('/getById/:id', 'VentesController.listById')
    Route.get('/getByIdUser/:id_user', 'VentesController.listByIdUser')
    Route.get('/getDetailVenteByIdUser/:id_vente', 'VentesController.detailVenteByIdVente')
    Route.post('/save', 'VentesController.save')
    Route.put('/update/:id', 'VentesController.update')
  }).prefix('/vente').middleware(['auth'])

  /// route pour les reservations
  Route.group(() => {
    Route.get('/list', 'ReservationsController.list')
    Route.get('/getById/:id', 'ReservationsController.listById')
    Route.get('/getByIdUser/:id_user', 'ReservationsController.listByIdUser')
    Route.get('/getDetailVenteByIdUser/:id_vente', 'ReservationsController.detailVenteByIdVente')
    Route.post('/save', 'ReservationsController.save')
    Route.put('/update/:id', 'ReservationsController.update')
  }).prefix('/reservation').middleware(['auth'])
}).prefix('/api')
