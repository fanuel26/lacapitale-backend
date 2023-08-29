// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import DetailVente from "App/Models/DetailVente";
import Produit from "App/Models/Produit";
import ResponseBody from "App/Models/ResponseBody";
import Vente from "App/Models/Vente";
import VenteRegistrationValidator from "App/Validators/VenteRegistrationValidator";

export default class VentesController {
  public async list({ response }) {
    const produit = await Vente.all();

    /// generation de response
    const responseBody = new ResponseBody();
    responseBody.status = true;
    responseBody.data = produit;
    responseBody.message = "Liste des ventes";
    return response.accepted(responseBody);
  }

  public async listById({ request, response }) {
    try {
      const produit = await Vente.findOrFail(request.params().id);
      return response.accepted({
        status: true,
        data: produit,
        message: "ventes par id",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async listByIdUser({ request, response }) {
    try {
      const produit = await Database.query()
        .from("ventes")
        .where("id_user", request.params().id_user);
      return response.accepted({
        status: true,
        data: produit,
        message: "ventes par id_user",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async detailVenteByIdVente({ request, response }) {
    try {
      const produit = await Database.from("detail_ventes")
        .where("detail_ventes.id_vente", request.params().id_vente)
        .join("produits", "produits.id", "detail_ventes.id_produit")
        .select("detail_ventes.*", "produits.libelle");

      return response.accepted({
        status: true,
        data: produit,
        message: "ventes par id_vente",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async save({ request, response }) {
    const data = await request.validate(VenteRegistrationValidator);
    console.log(data);
    if (data.errors && data.errors?.length != 0) {
      return data;
    }

    const addVentes = await Database.query()
      .from("add_ventes")
      .where("id_user", request.body().id_user);

    console.log(addVentes);
    if (addVentes.length != 0) {
      const produit = new Vente();
      produit.id_user = request.body().id_user;
      produit.prix_total = request.body().prix_total;
      produit.prix_client = request.body().prix_client;
      produit.monais_client = request.body().monais_client;

      try {
        await produit.save();

        for (let i = 0; i < addVentes.length; i++) {
          const av = new DetailVente();
          av.id_vente = produit.id;
          av.id_produit = addVentes[i].id_produit;
          av.id_user = addVentes[i].id_user;
          av.qte = addVentes[i].qte;
          av.prix_total = addVentes[i].prix_total;


          let pd = await Produit.query().where('id', addVentes[i].id_produit).firstOrFail()

          let dataUpade = {
            stock: pd.stock - addVentes[i].qte
          }
          try {
            await av.save();

            await Produit.query().where('id', addVentes[i].id_produit).update(dataUpade)
          } catch {
            console.log("error add vente");
          }
        }

        try {
          await Database.query()
            .from("add_ventes")
            .where("id_user", request.body().id_user)
            .delete();

          return response.accepted({
            status: true,
            data: produit,
            message: "vente créé avec success",
          });
        } catch {
          return response.accepted({
            status: false,
            message: "erreur! lors de la suppression de add vente",
          });
        }
      } catch {
        return response.accepted({
          status: false,
          data: produit,
          message: "erreur lors de l`'enregistrement!",
        });
      }
    } else {
      return response.accepted({
        status: false,
        message: "Add Vente inexistant",
      });
    }
  }

  public async update({ request, response }) {
    try {
      await Vente.query()
        .where("id", request.params().id)
        .update(request.body());
      const produit_value = await Vente.query().where(
        "id",
        request.params().id
      );

      return response.accepted({
        status: true,
        data: produit_value,
        message: "Mise a jour effectuer avec success",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur lors de la mise a jour!",
      });
    }
  }
}
