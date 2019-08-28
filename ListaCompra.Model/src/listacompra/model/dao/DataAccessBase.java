package listacompra.model.dao;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import listacompra.model.EntityFactory;
import listacompra.model.entidades.Entidade;

public abstract class DataAccessBase<T extends Entidade> {

    final Class<T> classBase;

    public DataAccessBase(Class<T> pClasse) {
        this.classBase = pClasse;
    }

    public void salvar(T pObjeto) throws Exception {
        EntityManager entity = EntityFactory.getEntityManager();
        EntityTransaction transaction = entity.getTransaction();

        try {
            transaction.begin();

            if (pObjeto.getId() == 0) {
                entity.persist(pObjeto);
            } else {
                entity.merge(pObjeto);
            }
            transaction.commit();
        } catch (Exception e) {
            transaction.rollback();
            throw e;
        } finally {
            entity.close();
        }
    }

    public void remover(int pObjetoId) throws Exception {
        
        EntityManager entity = EntityFactory.getEntityManager();
        EntityTransaction transaction = entity.getTransaction();

        try {
            T objeto = entity.find(classBase, pObjetoId);
            if (objeto == null) {
                throw new Exception(String.format("Não foi possível excluir o objeto '%s' pois o mesmo não foi encontrado.", pObjetoId));
            }

            transaction.begin();
            entity.remove(objeto);
            transaction.commit();
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw new Exception("Não foi possível excluir o objeto solicitado. Certifique-se de que o mesmo não está em uso no sistema.");
        } finally {
            entity.close();
        }
    }

    public T getObjectById(int pObjetoId) throws Exception {
        EntityManager entity = EntityFactory.getEntityManager();
        try {
            return (T) entity.find(classBase, pObjetoId);
        } finally {
            entity.close();
        }
    }
}
