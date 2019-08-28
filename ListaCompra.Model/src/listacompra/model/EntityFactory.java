package listacompra.model;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class EntityFactory {

    private static final EntityManagerFactory factory = Persistence.createEntityManagerFactory("ListaCompra.ModelPU");
    
    public static EntityManager getEntityManager() throws Exception{
        return factory.createEntityManager();
    }
}
