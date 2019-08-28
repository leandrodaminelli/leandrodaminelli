angular.module("listaCompras").controller("lcController", function ($scope, produtoService, listaCompraService) {
    function carregarProdutos() {
        produtoService.getProdutos().then(function (resultado) {
            $("#spinnerProdutos").hide();
            $scope.produtos = resultado.data;
        }, function () {
            alertify.error("Não foi possível completar sua requisição.")
        });
    };

    function carregarListas() {
        listaCompraService.getListas().then(function (resultado) {
            $("#spinnerlistasCompra").hide();
            listas = resultado.data;
            dscProdutos = "";
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

    function calcularTotalCarrinho() {
        valorTotal = 0;
        for (i = 0; i < $scope.carrinho.produtos.length; i++) {
            valorTotal += $scope.carrinho.produtos[i].valorTotal;
        }
        $scope.carrinho.valorTotal = valorTotal;
    };

    function iniciarCarrinho() {
        $scope.carrinho = {};
        $scope.carrinho.valorTotal = 0;
        $scope.carrinho.produtos = [];
    };

    $scope.adicionarProduto = function (produto) {
        if ($scope.produtoForm.nome.$invalid) {
            alertify.error("O nome do produto deve ser informado!");
            return;
        }
        if ($scope.produtoForm.preco.$error.required || 0 == produto.precoUnitario) {
            alertify.error("O preço do produto deve ser informado!");
            return;
        }
        if ($scope.produtoForm.preco.$error.pattern) {
            alertify.error('O preço foi informado em um formato inválido. Utilize "." como separador para até 4 casas decimais.');
            return;
        }

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

    $scope.removerProduto = function (produto) {
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

    $scope.adicionarAoCarrinho = function (produto) {
        alertify.prompt("Informe a quantidade desejada:", "0", function (evt, valor) {
            qtd = Number(valor);
            if (isNaN(qtd) || qtd <= 0) {
                alertify.error("Quantidade inválida.");
            } else {
                produtoCarrinho = {};
                produtoCarrinho.produtoId = produto.id;
                produtoCarrinho.nome = produto.nome;
                produtoCarrinho.precoUnitario = produto.precoUnitario;
                produtoCarrinho.quantidade = qtd;
                produtoCarrinho.valorTotal = produtoCarrinho.quantidade * produtoCarrinho.precoUnitario;
                $scope.carrinho.produtos.push(produtoCarrinho);

                calcularTotalCarrinho();
                $scope.$apply();
            }
        }).set({ title: "" });
    };

    $scope.removerProdutoCarrinho = function (produto) {
        alertify.confirm("Deseja excluir o produto '" + produto.nome + "' do carrinho?", function () {
            index = $scope.carrinho.produtos.indexOf(produto);
            if (index >= 0) {
                $scope.carrinho.produtos.splice(index, 1);
                calcularTotalCarrinho();
                $scope.$apply();
            }
        }).set({ title: "" });
    };

    $scope.adicionarLista = function (lista) {
        if (lista.produtos.length == 0) {
            alertify.error("Ao menos um produto deve ser inserido no carrinho!");
            return;
        }

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

    $scope.removerLista = function (lista) {
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

    carregarProdutos();
    carregarListas();
    iniciarCarrinho();
});