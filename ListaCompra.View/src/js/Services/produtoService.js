//Cria o serviço que será responsável por realizar as requisições contra o serviço de Produto da API
angular.module("listaCompras").factory("produtoService", function ($http) {
    var _getProdutos = function () {
        return $http.get(_UrlApi + '/Produto');
    };

    var _postProduto = function (produto) {
        return $http.post(_UrlApi + '/Produto', produto);
    };

    var _deleteProduto = function (id) {
        return $http.delete(_UrlApi + '/Produto/' + id)
    };

    return {
        getProdutos: _getProdutos,
        postProduto: _postProduto,
        deleteProduto: _deleteProduto
    };
});