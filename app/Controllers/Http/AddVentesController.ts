// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import AddVente from "App/Models/AddVente";
import ResponseBody from "App/Models/ResponseBody";
import AddVentesRegistrationValidator from "App/Validators/AddVentesRegistrationValidator";

export default class AddVentesController {
  public async list({ response }) {
    const produit = await Database.from("add_ventes")
      .join("produits", "produits.id", "add_ventes.id_produit")
      .select("add_ventes.*", "produits.*");

    /// generation de response
    const responseBody = new ResponseBody();
    responseBody.status = true;
    responseBody.data = produit;
    responseBody.message = "Liste des produit";
    return response.accepted(responseBody);
  }

  public async listByIdProduit({ request, response }) {
    try {
      const produit = await Database.query()
        .from("add_ventes")
        .where("id_produit", request.params().id_produit);
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

  public async listByIdUser({ request, response }) {
    try {
      const produit = await Database.from("add_ventes")
        .where("add_ventes.id_user", request.params().id_user)
        .join("produits", "produits.id", "add_ventes.id_produit")
        .select("add_ventes.*", "produits.libelle");

      return response.accepted({
        status: true,
        data: produit,
        message: "produit par id_user",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async DeleteByIdUser({ request, response }) {
    try {
      const produit = await Database.query()
        .from("add_ventes")
        .where("id_user", request.params().id_user)
        .delete();

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

  public async DeleteById({ request, response }) {
    console.log(request.params())
    try {
      const produit = await Database.query()
        .from("add_ventes")
        .where("id", request.params().id)
        .delete();
        console.log(produit)

      return response.accepted({
        status: true,
        data: produit,
        message: "suppression add vente par id",
      });
    } catch {
      return response.accepted({
        status: false,
        message: "erreur! id nom trouvez",
      });
    }
  }

  public async save({ request, response }) {
    const data = await request.validate(AddVentesRegistrationValidator);

    console.log(data);
    if (data.errors && data.errors?.length != 0) {
      return data;
    }

    const produit = new AddVente();
    produit.id_produit = request.body().id_produit;
    produit.id_user = request.body().id_user;
    produit.qte = request.body().qte;
    produit.prix_total = request.body().prix_total;

    try {
      await produit.save();
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
      await AddVente.query()
        .where("id", request.params().id)
        .update(request.body());
      const produit_value = await AddVente.query().where(
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
