package listacompra.model.dao;

import java.util.List;
import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import listacompra.model.entidades.ListaCompra;

@Stateless
public class ListaCompraDAO extends DataAccessBase<ListaCompra> {

    @PersistenceContext(unitName = "ListaCompra.ModelPU")
    EntityManager entity;

    public ListaCompraDAO() {
        super(ListaCompra.class);
    }

    public List<ListaCompra> getAll() throws Exception {
        return entity.createQuery("SELECT l FROM ListaCompra l").getResultList();
    }
}
