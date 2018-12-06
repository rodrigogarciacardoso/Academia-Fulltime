$(".btn-salvar").click(function () {
    var id_venda = $("#id_venda").val();
    if (id_venda == -1) {
        var dados = getDadosInclusaoItens();
        dados.id = guid();
        vendas.push(dados);
    } else {
        atualizarVenda(id_venda);
    }
    classInvisivel();
    atualizarGridPrincipal();
})

function atualizarVenda(id) {
    var venda = vendas.find(x => x.id == id);
    var index = vendas.indexOf(venda);
    if (vendas[index] != null || vendas[index] != undefined) {
        vendas[index].dataHora = $("#txt_dataHora").find("input").val();
        vendas[index].cliente = $("#txt_cliente").val();
        vendas[index].valorTotal = calcularValorTotal();
        vendas[index].itens = itensVenda;
    }
}

function getDadosInclusaoItens() {
    return {
        id: -1,
        dataHora: $("#txt_dataHora").find("input").val(),
        cliente: $("#txt_cliente").val(),
        valorTotal: calcularValorTotal(),
        itens: itensVenda
    }
}

function calcularValorTotal() {
    var total = 0;
    if (itensVenda != undefined || itensVenda != null) {
        $.each(itensVenda, function (i, idItem) {
            var item = itens.find(x => x.id == idItem);
            if (item != undefined || item != null) {
                total += Number(item.valorTotal);
            }
        })
    }
    return total.toFixed(2);
}

function atualizarGridPrincipal() {
    $(".gridVenda").html("");
    $.each(vendas, function (i, venda) {
        setDadosGridPrincipal(venda)
    })
}

function setDadosGridPrincipal(dados) {
    bootbox.hideAll();
    $(".gridVenda").append(
        '<tr>                                                                                                                                                         ' +
        '   <td class="id">' + dados.id + '</td>                                                                                                                      ' +
        '   <td >' + dados.dataHora + '</td>                                                                                                                          ' +
        '   <td >' + dados.cliente + '</td>                                                                                                                           ' +
        '   <td class="money">' + dados.valorTotal + '</td>                                                                                                           ' +
        '   <td class="col-md-2">                                                                                                                                     ' +
        '       <a class="btn btn-default btn-alterar" role="button"><i class="glyphicon glyphicon-edit"></i> Editar</a>                                              ' +
        '       <a class="btn btn-danger btn-excluir" role="button"><i class="glyphicon glyphicon-trash"></i> Excluir</a>                                             ' +
        '   </td>                                                                                                                                                     ' +
        '</tr>');

    $(".btn-alterar").unbind("click");
    $(".btn-excluir").unbind("click");
    addEventoClickPrincipal();
}

function addEventoClickPrincipal() {
    $(".btn-alterar").click(function () {
        limparCampos();
        classInvisivel();
        var $row = $(this).parents().closest("tr");
        var id = $row.find('.id').text();
        preencherDadosVendasParaEdicao(id);
    })
    $(".btn-excluir").click(function () {
        var $row = $(this).parents().closest("tr");
        var id = $row.find(".id").text();
        $row.fadeOut(400, function () {
            $row.remove();
        });        
        var item = vendas.find(x => x.id == id);
        var index = vendas.indexOf(item);
        var venda = vendas[index];
        $.each(venda.itens, function (i, item) {
            removerItens(item);
        })
        vendas.splice(index, 1);
    })
}

function preencherDadosVendasParaEdicao(id) {
    var venda = vendas.find(x => x.id == id);
    $("#id_venda").val(venda.id);
    $("#txt_cliente").val(venda.cliente);
    $("#txt_dataHora").find("input").val(venda.dataHora);
    $(".valorTotalGrid").find("span").text(venda.valorTotal);
    itensVenda = venda.itens;
    $.each(venda.itens, function (i, idItem) {
        var item = itens.find(x => x.id == idItem);
        setDadosGrid(item);
    })
}

function limparCampos() {
    $(".gridItem").html("");
    $("#txt_dataHora").find("input").val("");
    $("#txt_cliente").val("");
    $(".valorTotalGrid").find("span").text("");
}