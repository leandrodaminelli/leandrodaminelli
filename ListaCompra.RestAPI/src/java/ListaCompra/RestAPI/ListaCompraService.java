package ListaCompra.RestAPI;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import javax.inject.Inject;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import listacompra.model.dao.ListaCompraDAO;
import listacompra.model.entidades.ListaCompra;
import listacompra.model.entidades.Produto;

@Path("ListaCompra")
public class ListaCompraService {

    @Context
    private UriInfo context;

    @Inject
    private ListaCompraDAO dao;
    
    public ListaCompraService() {
    }

    /**
     * Retorna todas as listas de compras presentes na base de dados
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJson() {
        GsonBuilder gBuilder = new GsonBuilder();
        Gson jObject = gBuilder.create();

        try {
            return jObject.toJson(dao.getAll());
        } catch (Exception e) {
            Resposta lResposta = new Resposta();

            lResposta.setMensagem(e.getMessage());
            lResposta.setSucesso(false);

            return jObject.toJson(lResposta);
        }
    }

    /**
     * Recupera a lista de acordo com o Id especificado
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getJson(@PathParam("id") int id) {
        GsonBuilder gBuilder = new GsonBuilder();
        Gson jObject = gBuilder.create();

        try {
            return jObject.toJson(dao.getObjectById(id));
        } catch (Exception e) {
            Resposta lResposta = new Resposta();

            lResposta.setMensagem(e.getMessage());
            lResposta.setSucesso(false);

            return jObject.toJson(lResposta);
        }
    }

    /**
     * Insere nova lista de compras de acordo com a requisição recebida
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String putJson(String content) {
        Resposta lResposta = new Resposta();
        GsonBuilder gBuilder = new GsonBuilder();
        Gson jObject = gBuilder.create();

        try {
            ListaCompra lLista = jObject.fromJson(content, ListaCompra.class);
            
            //Ajusta os objetos para o formato entnedido pelo DAO
            lLista.getProdutos().forEach((linha) -> {
                Produto p = new Produto();
                p.setId(linha.getProdutoId());
                linha.setProduto(p);
            });
            
            dao.salvar(lLista);

            lResposta.setMensagem("Sucesso");
            lResposta.setSucesso(true);
        } catch (Exception e) {
            lResposta.setMensagem(e.getMessage());
            lResposta.setSucesso(false);
        }

        return jObject.toJson(lResposta);
    }

    /**
     * Remove a lista desejada
     */
    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteJson(@PathParam("id") int id) {

        Resposta lResposta = new Resposta();
        GsonBuilder gBuilder = new GsonBuilder();
        Gson jObject = gBuilder.create();

        try {
            dao.remover(id);

            lResposta.setMensagem("Sucesso");
            lResposta.setSucesso(true);
        } catch (Exception e) {
            lResposta.setMensagem(e.getMessage());
            lResposta.setSucesso(false);
        }

        return jObject.toJson(lResposta);
    }

    /**
     * Classe para mapear o JSON de resposta das requisições
     */
    private class Resposta {

        private String mensagem;
        private boolean sucesso;

        public String getMensagem() {
            return mensagem;
        }

        public void setMensagem(String mensagem) {
            this.mensagem = mensagem;
        }

        public boolean isSucesso() {
            return sucesso;
        }

        public void setSucesso(boolean sucesso) {
            this.sucesso = sucesso;
        }
    }
}
