// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import LotProduit from "App/Models/LotProduit";
import Produit from "App/Models/Produit";
import ResponseBody from "App/Models/ResponseBody";
import LotProduitRegistrationValidator from "App/Validators/LotProduitRegistrationValidator";

export default class LotProduitsController {
  public async list({ response }) {
    const produit = await LotProduit.all();

    /// generation de response
    const responseBody = new ResponseBody();
    responseBody.status = true;
    responseBody.data = produit;
    responseBody.message = "Liste des lot de produit";
    return response.accepted(responseBody);
  }

  public async listState({ response }) {
    const produit = await Produit.all()

    /// generation de response
    const responseBody = new ResponseBody();

    responseBody.status = true;
    responseBody.data = produit;
    responseBody.message = "Liste des lot de produit";
    return response.accepted(responseBody);
  }


  public async listById({ request, response }) {
    try {
      const produit = await LotProduit.findOrFail(request.params().id);
      return response.accepted({
        status: true,
        data: produit,
        message: "produit par id",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async getByIdProduit({ request, response }) {
    try {
      const produit = await Database.query()
        .from("lot_produits")
        .where("id_produit", request.params().idProduit);
      return response.accepted({
        status: true,
        data: produit,
        message: "produit par id",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async getStateVente({ request, response }) {
    try {
      const nbrQte = await Database.query()
        .from("lot_produits")
        .where("id_produit", request.params().idProduit)
        .sum("qte", "qte");

      const nbrQteVente = await Database.query()
        .from("detail_ventes")
        .where("id_produit", request.params().idProduit)
        .sum("qte", "qte");

      let data = {
        nbrQte: nbrQte[0].qte,
        nbrQteVente: nbrQteVente[0].qte,
      };
      return response.accepted({
        status: true,
        data: data,
        message: "produit par id",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async save({ request, response }) {
    const data = await request.validate(LotProduitRegistrationValidator);

    console.log(data);
    if (data.errors && data.errors?.length != 0) {
      return data;
    }

    let pd = await Produit.query().where('id', request.body().id_produit).firstOrFail()

    const produit = new LotProduit();
    produit.id_produit = request.body().id_produit;
    produit.qte = request.body().qte;
    produit.prix_achat = request.body().prix_achat;
    // produit.prix_vente_unique = request.body().prix_vente_unique

    try {
      await produit.save();

      let dataUpade = {
        stock: pd.stock + request.body().qte
      }
      await Produit.query().where('id', request.body().id_produit).update(dataUpade)

      return response.accepted({
        status: true,
        data: produit,
        message: "produit créé avec success",
      });
    } catch {
      return response.accepted({
        status: false,
        data: produit,
        message: "erreur lors de l`'enregistrement!",
      });
    }
  }

  public async update({ request, response }) {
    try {
      let data = {
        qte: request.body().qte,
        prix_achat: request.body().prix_achat
      }
      await LotProduit.query()
        .where("id", request.params().id)
        .update(data);
      const produit_value = await LotProduit.query().where(
        "id",
        request.params().id
      );


      let pd = await Produit.query().where('id', request.body().id_produit).firstOrFail()

      let dataUpade = {
        stock: pd.stock + request.body().diff
      }

      try {
        await Produit.query().where('id', request.body().id_produit).update(dataUpade)

        return response.accepted({
          status: true,
          data: produit_value,
          message: "Mise a jour effectuer avec success",
        });
      } catch {
        return response.accepted({
          status: false,
          message: "erreur lors de la mise a jour! level 2",
        });
      }
    } catch {
      return response.accepted({
        status: false,
        message: "erreur lors de la mise a jour!",
      });
    }
  }
}
