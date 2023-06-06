// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database"
import ParamVente from "App/Models/ParamVente"
import ResponseBody from "App/Models/ResponseBody"
import ParamVenteRegistrationValidator from "App/Validators/ParamVenteRegistrationValidator"

export default class ParamVentesController {
  public async list({ response }) {
    const produit = await ParamVente.all()

    /// generation de response
    const responseBody = new ResponseBody
    responseBody.status = true
    responseBody.data = produit
    responseBody.message = 'Liste des param vente'
    return response.accepted(responseBody)
  }

  public async listById({ request, response }) {
      try {
          const produit = await ParamVente.findOrFail(request.params().id)
          return response.accepted({ status: true, data: produit, message: 'produit par id' })
      } catch {
          return response.accepted({ status: false, message: 'erreur! id nom trouvez' })
      }
  }

  public async getByIdProduit({ request, response }) {
    try {
        const produit = await Database.query()
        .from("param_ventes")
        .where("id_produit", request.params().idProduit).first();
        return response.accepted({ status: true, data: produit, message: 'produit par id' })
    } catch {
        return response.accepted({ status: false, message: 'erreur! id nom trouvez' })
    }
}

  public async save({ request, response }) {
      const data = await request.validate(ParamVenteRegistrationValidator)

      console.log(data)
      if (data.errors && data.errors?.length != 0) {
          return data
      }

      const produit = new ParamVente()
      produit.id_produit = request.body().id_produit
      produit.prix_vente_unique = request.body().prix_vente_unique

      try {
          await produit.save()
          return response.accepted({ status: true, data: produit, message: 'produit créé avec success' })
      } catch {
          return response.accepted({ status: false, data: produit, message: 'erreur lors de l`\'enregistrement!' })
      }
  }

  public async update({ request, response }) {
      try {
          await ParamVente.query().where('id', request.params().id).update(request.body())
          const produit_value = await ParamVente.query().where('id', request.params().id)

          return response.accepted({ status: true, data: produit_value, message: 'Mise a jour effectuer avec success' })
      } catch {
          return response.accepted({ status: false, message: 'erreur lors de la mise a jour!' })
      }
  }
}
