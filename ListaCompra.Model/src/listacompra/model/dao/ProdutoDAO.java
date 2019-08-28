package listacompra.model.dao;

import java.util.List;
import javax.persistence.EntityManager;
import listacompra.model.EntityFactory;
import listacompra.model.entidades.Produto;

public class ProdutoDAO extends DataAccessBase<Produto> {

    public ProdutoDAO() {
        super(Produto.class);
    }

    public List<Produto> getAll() throws Exception {
        EntityManager entity = EntityFactory.getEntityManager();
        return entity.createQuery("SELECT p FROM Produto p").getResultList();
    }
}
