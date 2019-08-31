package listacompra.model;

import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;

@ApplicationScoped
public class EntityFactory {

    @PersistenceUnit(unitName = "ListaCompra.ModelPU")
    private EntityManagerFactory factory;

    @RequestScoped
    @Produces
    public EntityManager getEntityManager() throws Exception {
        return factory.createEntityManager();
    }
    
    public void closeEntityManager(@Disposes EntityManager entity) {
        if (entity.isOpen()) {
            entity.close();
        }
    }
}