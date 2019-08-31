package listacompra.model.dao;

import java.util.List;
import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import listacompra.model.entidades.Produto;

@Stateless
public class ProdutoDAO extends DataAccessBase<Produto> {

    @PersistenceContext(unitName = "ListaCompra.ModelPU")
    EntityManager entity;

    public ProdutoDAO() {
        super(Produto.class);
    }

    public List<Produto> getAll() throws Exception {
        return entity.createQuery("SELECT p FROM Produto p").getResultList();
    }
}
