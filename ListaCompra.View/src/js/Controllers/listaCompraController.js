var alertify = require("alertifyjs/build/alertify.min.js");
var $ = require("jquery/dist/jquery.min.js");
require('../Services/listaCompraService');
require('../Services/produtoService');

//Declara o controller da aplicação, injetando os serviços que serão utilizados
angular.module("listaCompras").controller("lcController", function ($scope, produtoService, listaCompraService) {
    //Carrega os produtos através do get na API
    function carregarProdutos() {
        produtoService.getProdutos().then(function (resultado) {
            //Esconde o spinner que indica carregamento
            $("#spinnerProdutos").hide();
            $scope.produtos = resultado.data;
        }, function () {
            alertify.error("Não foi possível completar sua requisição.")
        });
    };
    //Carrega as listas salvas através do get na API
    function carregarListas() {
        listaCompraService.getListas().then(function (resultado) {
            //Esconde o spinner que indica carregamento
            $("#spinnerlistasCompra").hide();
            listas = resultado.data;
            dscProdutos = "";
            //Itera nos produtos da lista para somar o valor total e montar a coluna com a descrição dos produtos
            for (i = 0; i < listas.length; i++) {
                valorTotal = 0;
                lista = listas[i];
                for (x = 0; x < lista.produtos.length; x++) {
                    produto = lista.produtos[x];
                    valorTotal += produto.valorTotal;
                    dscProdutos += "(" + produto.quantidade + "x) " + produto.produto.nome + "\n";
                }
                lista.valorTotal = valorTotal;
                lista.dscProdutos = dscProdutos;
            }
            $scope.listasCompra = listas;
        }, function () {
            alertify.error("Não foi possível completar sua requisição.")
        });
    };
    //Atualiza o valor total do carrinho
    function calcularTotalCarrinho() {
        valorTotal = 0;
        for (i = 0; i < $scope.carrinho.produtos.length; i++) {
            valorTotal += $scope.carrinho.produtos[i].valorTotal;
        }
        $scope.carrinho.valorTotal = valorTotal;
    };
    //Reseta a tabela do carrinho de compras
    function iniciarCarrinho() {
        $scope.carrinho = {};
        $scope.carrinho.valorTotal = 0;
        $scope.carrinho.produtos = [];
    };
    //Adiciona o produto no BD da aplicação
    $scope.adicionarProduto = function (produto) {
        //Faz as validações necessárias
        if ($scope.produtoForm.nome.$invalid) {
            alertify.error("O nome do produto deve ser informado!");
            return;
        }
        if ($scope.produtoForm.preco.$error.required || 0 == produto.precoUnitario) {
            alertify.error("O preço do produto deve ser informado!");
            return;
        }
        if ($scope.produtoForm.preco.$error.pattern) {
            alertify.error('O preço foi informado em um formato inválido. Utilize "." como separador para até 2 casas decimais.');
            return;
        }
        //Envia o objeto à API
        produtoService.postProduto(produto).then(function (resultado) {
            if (resultado.data.sucesso) {
                carregarProdutos();
                alertify.success("Produto inserido com sucesso.");
                produto.nome = "";
                produto.precoUnitario = "";
            }
            else {
                alertify.error(resultado.data.mensagem)
            }
        }, function () {
            alertify.error("Não foi possível completar sua requisição.")
        });
    };
    //Remove o produto do BD da aplicação
    $scope.removerProduto = function (produto) {
        //Não permite excluir o produto caso o mesmo esteja no carrinho
        for(i = 0; i < $scope.carrinho.produtos.length; i++){
            if(produto.id == $scope.carrinho.produtos[i].produtoId){
                alertify.error("Não é possível excluir um produto que está no carrinho!");
                return;
            }
        }
        //Solicita confirmação do usuário para prosseguir
        alertify.confirm("Deseja excluir o produto '" + produto.nome + "'?", function () {
            produtoService.deleteProduto(produto.id).then(function (resultado) {
                if (resultado.data.sucesso) {
                    carregarProdutos();
                    alertify.success("Produto excluído com sucesso.");
                } else {
                    alertify.error(resultado.data.mensagem);
                }
            }, function () {
                alertify.error("Não foi possível completar sua requisição.")
            })
        }).set({ title: "" });
    };
    //Adiciona o produto desejado ao carrinho
    $scope.adicionarAoCarrinho = function (produto) {
        //Solicita ao usuário a quantidade a adicionar ao carrinho
        alertify.prompt("Informe a quantidade desejada:", "0", function (evt, valor) {

            //Valida se o valor informado é numérico e se é maior que 0
            qtd = Number(valor);
            if (isNaN(qtd) || qtd <= 0) {
                alertify.error("Quantidade inválida.");
                return;
            }

            produtoCarrinho = {};
            produtoCarrinho.produtoId = produto.id;
            produtoCarrinho.nome = produto.nome;
            produtoCarrinho.precoUnitario = produto.precoUnitario;
            produtoCarrinho.quantidade = qtd;
            produtoCarrinho.valorTotal = produtoCarrinho.quantidade * produtoCarrinho.precoUnitario;
            $scope.carrinho.produtos.push(produtoCarrinho);

            calcularTotalCarrinho();
            $scope.$apply();
        }).set({ title: "" });
    };
    //Remove o produto selecionado do carrinho de compras
    $scope.removerProdutoCarrinho = function (produto) {
        //Solicita a confirmação do usuário
        alertify.confirm("Deseja excluir o produto '" + produto.nome + "' do carrinho?", function () {
            index = $scope.carrinho.produtos.indexOf(produto);
            if (index >= 0) {
                $scope.carrinho.produtos.splice(index, 1);
                calcularTotalCarrinho();
                $scope.$apply();
            }
        }).set({ title: "" });
    };
    //Adiciona a lista ao BD da aplicação
    $scope.adicionarLista = function (lista) {
        //Validações necessárias
        if (lista.produtos.length == 0) {
            alertify.error("Ao menos um produto deve ser inserido no carrinho!");
            return;
        }
        //Envia à API o objeto
        listaCompraService.postLista(lista).then(function (resultado) {
            if (resultado.data.sucesso) {
                alertify.success("Lista inserida com sucesso.");
                iniciarCarrinho();
                carregarListas();
            } else {
                alertify.error(resultado.data.mensagem);
            }
        }, function () {
            alertify.error("Não foi possível completar sua requisição.")
        });
    };
    //Remove a lista do BD da aplicação
    $scope.removerLista = function (lista) {
        //Solicita confirmação do usuário
        alertify.confirm("Deseja excluir a lista '" + lista.id + "'?", function () {
            listaCompraService.deleteLista(lista.id).then(function (resultado) {
                if (resultado.data.sucesso) {
                    carregarListas();
                    alertify.success("Lista excluída com sucesso.");
                } else {
                    alertify.error(resultado.data.mensagem);
                }
            }, function () {
                alertify.error("Não foi possível completar sua requisição.")
            })
        }).set({ title: "" });
    };

    //Inicia a aplicação carregando os dados do BD
    carregarProdutos();
    carregarListas();
    iniciarCarrinho();
});