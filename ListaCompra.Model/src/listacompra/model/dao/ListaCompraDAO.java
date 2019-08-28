package listacompra.model.dao;

import java.util.List;
import javax.persistence.EntityManager;
import listacompra.model.EntityFactory;
import listacompra.model.entidades.ListaCompra;

public class ListaCompraDAO extends DataAccessBase<ListaCompra> {

    public ListaCompraDAO() {
        super(ListaCompra.class);
    }
    
    public List<ListaCompra> getAll() throws Exception {
        EntityManager entity = EntityFactory.getEntityManager();
        return entity.createQuery("SELECT l FROM ListaCompra l").getResultList();
    }
}
