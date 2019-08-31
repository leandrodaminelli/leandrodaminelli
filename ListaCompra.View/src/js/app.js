//Variável global para guardar a referencia da URL da API em uso
window._UrlApi = "http://leandrodaminelli.ddns.net:8080/ListaCompra/RestAPI";

//Inicia o módulo da aplicação no angular
//Uso o caminho explícito da versão min para gerar um bundle reduzido
require('../../node_modules/angular/angular.min.js');
angular.module("listaCompras", []);

//Importa / inicia o controlador da aplicação
require('./Controllers/listaCompraController');