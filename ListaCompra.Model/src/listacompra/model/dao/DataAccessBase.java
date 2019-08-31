package listacompra.model.dao;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import listacompra.model.entidades.Entidade;

@Stateless
public abstract class DataAccessBase<T extends Entidade> {

    final Class<T> classBase;

    @PersistenceContext(unitName = "ListaCompra.ModelPU")
    EntityManager entity;

    public DataAccessBase(Class<T> pClasse) {
        this.classBase = pClasse;
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void salvar(T pObjeto) throws Exception {
        try {
            if (pObjeto.getId() == 0) {
                entity.persist(pObjeto);
            } else {
                entity.merge(pObjeto);
            }
        } catch (Exception e) {
            throw e;
        } finally {
            entity.close();
        }
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void remover(int pObjetoId) throws Exception {
        try {
            T objeto = entity.find(classBase, pObjetoId);
            if (objeto == null) {
                throw new Exception(String.format("Não foi possível excluir o objeto '%s' pois o mesmo não foi encontrado.", pObjetoId));
            }
            entity.remove(objeto);
        } catch (Exception e) {
            throw new Exception("Não foi possível excluir o objeto solicitado. Certifique-se de que o mesmo não está em uso no sistema.");
        } finally {
            entity.close();
        }
    }

    public T getObjectById(int pObjetoId) throws Exception {
        try {
            return (T) entity.find(classBase, pObjetoId);
        } finally {
            entity.close();
        }
    }
}
