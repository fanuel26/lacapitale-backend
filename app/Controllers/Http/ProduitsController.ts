
// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Produit from "App/Models/Produit"
import ResponseBody from "App/Models/ResponseBody"
import Vente from "App/Models/Vente";
import ProduitRegistrationValidator from "App/Validators/ProduitRegistrationValidator"

export default class ProduitsController {
  public async list({ response }) {
    const produit = await Produit.all()
    const produitWithPrice = await Database.from("produits").join("param_ventes", "produits.id", "param_ventes.id_produit")
    .select("produits.*", "param_ventes.prix_vente_unique");

    /// generation de response
    const responseBody = new ResponseBody
    responseBody.status = true
    responseBody.data = produit
    responseBody.dataSecond = produitWithPrice
    responseBody.message = 'Liste des produit'
    return response.accepted(responseBody)
  }

  public async Statistique({ response }) {
    let now = new Date();
    let date = `${now.getFullYear()}-${now.getMonth()+1 < 10 ? '0'+(now.getMonth()+1) : now.getMonth()+1}-${now.getDate() < 10 ? '0'+now.getDate() : now.getDate()}`
    // let now_splite = now.splice('T')
    const produit = await Produit.all();

    const produit_jour = await Produit.query().where('created_at', 'LIKE', `%${date}%`)

    const vente = await Vente.all();
    const vente_jour = await Vente.query().where('created_at', 'LIKE', `%${date}%`);

    const montant_vente = await Database.query()
      .from("ventes")
      .sum("prix_total", "prix_total");

      const nbrQte = await Database.query()
        .from("lot_produits")
        .sum("qte", "qte");

      const prixAchat = await Database.query()
      .from("lot_produits")
      .sum("prix_achat", "prix_achat");

      const montant_vente_jour = await Database.query()
      .from("ventes").where('created_at', 'LIKE', `%${date}%`)
      .sum("prix_total", "prix_total");

      const nbrQte_jour = await Database.query()
        .from("lot_produits").where('created_at', 'LIKE', `%${date}%`)
        .sum("qte", "qte");

      const prixAchat_jour = await Database.query()
      .from("lot_produits").where('created_at', 'LIKE', `%${date}%`)
      .sum("prix_achat", "prix_achat");

    let data = {
      'nbrProduit': produit.length,
      'nbrVente': vente.length,
      'montantVente': montant_vente[0].prix_total,
      'qteEntrerStock': nbrQte[0].qte,
      'prixAchatStock': prixAchat[0].prix_achat,
      'montantVenteJour': montant_vente_jour[0].prix_total,
      'qteEntrerStockJour': nbrQte_jour[0].qte,
      'prixAchatStockJour': prixAchat_jour[0].prix_achat,
      'produitJour': produit_jour.length,
      'venteJour': vente_jour.length
    }
    /// generation de response
    const responseBody = new ResponseBody
    responseBody.status = true
    responseBody.data = data
    responseBody.message = 'Liste des produit'
    return response.accepted(responseBody)
  }

  public async listById({ request, response }) {
      try {
          const produit = await Produit.findOrFail(request.params().id)
          return response.accepted({ status: true, data: produit, message: 'produit par id' })
      } catch {
          return response.accepted({ status: false, message: 'erreur! id nom trouvez' })
      }
  }

  public async save({ request, response }) {
      const data = await request.validate(ProduitRegistrationValidator)

      if (data.errors && data.errors?.length != 0) {
          return data
      }

      console.log(data)

      const produit = new Produit()
      produit.libelle = request.body().libelle
      // produit.qte = request.body().qte
      // produit.prix_achat = request.body().prix_achat
      // produit.prix_vente_unique = request.body().prix_vente_unique

      try {
          let rslt = await produit.save()

          console.log(rslt)
          return response.accepted({ status: true, data: produit, message: 'produit créé avec success' })
      } catch {
          return response.accepted({ status: false, data: produit, message: 'erreur lors de l`\'enregistrement!' })
      }
  }

  public async update({ request, response }) {
      try {
          await Produit.query().where('id', request.params().id).update(request.body())
          const produit_value = await Produit.query().where('id', request.params().id)

          return response.accepted({ status: true, data: produit_value, message: 'Mise a jour effectuer avec success' })
      } catch {
          return response.accepted({ status: false, message: 'erreur lors de la mise a jour!' })
      }
  }
}
