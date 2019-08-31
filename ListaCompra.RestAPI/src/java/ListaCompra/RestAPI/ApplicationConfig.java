package ListaCompra.RestAPI;

import ListaCompra.RestAPI.Utils.ResponseFilter;
import java.util.Set;
import javax.ws.rs.core.Application;

@javax.ws.rs.ApplicationPath("RestAPI")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        resources.add(ResponseFilter.class);
        addRestResourceClasses(resources);
        return resources;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(ListaCompra.RestAPI.ListaCompraService.class);
        resources.add(ListaCompra.RestAPI.ProdutoService.class);
    }
}