$(document).ready(function () {
    $(".btn-incluir").click(function () {
        $("#id_venda").val(-1);
        limparCampos();
        classInvisivel();
        itensVenda = [];
    })

    $(".btn-voltar").click(function () {
        limparCampos();
        classInvisivel();
    })

    $("#btn-incluir-item").click(function () {
        abrirModal(getDadosInclusao());
        $(".btn_confirmar").click(function () {
            var dados = getDadosModal();
            if (dados != null || dados != undefined) {
                if (dados.id == -1) {
                    dados.id = guid();
                    itens.push(dados);
                    itensVenda.push(dados.id);
                    setDadosGrid(dados);
                    atualizaTotalGrid();
                }
            }
        })
    })
    $(function () {
        $('#txt_dataHora').datetimepicker({
            locale: 'pt-br'
        });
    });
})

function recarregarGrid() {
    $(".gridItem").html("");
    $.each(itens, function (index, item) {
        setDadosGrid(item);
    })
}

var vendas = [];
var itens = [];
var itensVenda = [];

function getDadosArray(id) {
    var item = itens.find(x => x.id == id);        
    return item;
}

function addEventoClick() {
    $(".btn-alterar-form").click(function () {
        var $row = $(this).parents().closest("tr");
        var id = $row.find(".id").text();
        abrirModal(getDadosArray(id));
        $(".btn_confirmar").click(function () {
            var dados = getDadosModal();
            if (dados != null || dados != undefined) {
                var item = itens.find(x => x.id == id);
                var index = itens.indexOf(item);
                itens[index] = dados;
                recarregarGrid();
                atualizaTotalGrid();
            }
        })
    })
    $(".btn-excluir-form").click(function () {
        var $row = $(this).parents().closest("tr");
        var id = $row.find(".id").text();
        $row.fadeOut(400, function () {
            $row.remove();
        });
        removerItens(id);
        var id_venda = $("#id_venda").val();
        atualizarVenda(id_venda);        
        atualizaTotalGrid();
    })
}

function removerItens(id) {
    var item = itens.find(x => x.id == id);
    var index = itens.indexOf(item);
    itens.splice(index, 1);
    var item = itensVenda.find(x => x == id);
    var index = itensVenda.indexOf(item);
    itensVenda.splice(index, 1);
}

function atualizaTotalGrid() {
    var total = calcularValorTotal();
    $(".valorTotalGrid").find("span").html("<span>" + total + "</span>");
}

function getDadosInclusao() {
    return {
        id: -1,
        descricao: '',
        quantidade: 0,
        valorUnitario: 0.00,
        valorTotal: 0.00
    };
}

function setDadosForm(dados) {
    $('#txt_id').val(dados.id);
    $('#txt_descricao').val(dados.descricao);
    $('#txt_quantidade').val(dados.quantidade);
    $('#txt_valorUnitario').val(dados.valorUnitario);
    $('#txt_valorTotal_form').val(dados.valorTotal);
}

function getDadosModal() {
    return {
        id: $("#txt_id").val(),
        descricao: $("#txt_descricao").val(),
        quantidade: $("#txt_quantidade").val(),
        valorUnitario: $("#txt_valorUnitario").val(),
        valorTotal: $("#txt_valorTotal_form").val()
    }
}

function setDadosGrid(dados) {
    bootbox.hideAll();
    $(".gridItem").append(
        '<tr>                                                                                                                                                         ' +
        '   <td class="id">' + dados.id + '</td>                                                                                                                      ' +
        '   <td>' + dados.descricao + '</td>                                                                                                                          ' +
        '   <td>' + dados.quantidade + '</td>                                                                                                                         ' +
        '   <td class="money">' + dados.valorUnitario + '</td>                                                                                                        ' +
        '   <td class="money">' + dados.valorTotal + '</td>                                                                                                           ' +
        '   <td class="col-md-2">                                                                                                                                     ' +
        '       <a class="btn btn-default btn-alterar-form" role="button"><i class="glyphicon glyphicon-edit"></i> Editar</a>                                         ' +
        '       <a class="btn btn-danger btn-excluir-form" role="button"><i class="glyphicon glyphicon-trash"></i> Excluir</a>                                        ' +
        '   </td>                                                                                                                                                     ' +
        '</tr>');

    $(".btn-alterar-form").unbind("click");
    $(".btn-excluir-form").unbind("click");
    addEventoClick();
}

function classInvisivel() {
    $("#grid").toggleClass("invisivel");
    $("#formulario").toggleClass("invisivel");
}

function abrirModal(dados) {
    bootbox.dialog({
            title: 'Cadastro de Item',
            message: '<div class="row">                                                                                                                                                                                      ' +
                '    <div class="form-group col-md-4 invisivel">                                                                                                                                                             ' +
                '        <input type="text" class="form-control" id="txt_id" placeholder="id">                                                                                                                               ' +
                '    </div>                                                                                                                                                                                                  ' +
                '    <div class="form-group col-md-4">                                                                                                                                                                       ' +
                '        <label for="txt_descricao">Descrição</label>                                                                                                                                                        ' +
                '        <input type="text" class="form-control" id="txt_descricao" placeholder="Descrição">                                                                                                                 ' +
                '    </div>                                                                                                                                                                                                  ' +
                '    <div class="form-group col-md-2">                                                                                                                                                                       ' +
                '        <label for="txt_quantidade">Quantidade</label>                                                                                                                                                      ' +
                '        <input type="text" class="form-control" id="txt_quantidade" placeholder="Quantidade" min="0">                                                                                                       ' +
                '    </div>                                                                                                                                                                                                  ' +
                '    <div class="form-group col-md-3">                                                                                                                                                                       ' +
                '        <label for="txt_valorUnitario">Valor Unitário</label>                                                                                                                                               ' +
                '        <input type="text" class="form-control money" id="txt_valorUnitario" placeholder="Valor Unitário" data-affixes-stay="true" data-prefix="R$ " data-thousands="." data-decimal=",">                   ' +
                '    </div>                                                                                                                                                                                                  ' +
                '    <div class="form-group col-md-3">                                                                                                                                                                       ' +
                '        <label for="txt_valorTotal_form">Valor Total</label>                                                                                                                                                ' +
                '        <input type="text" class="form-control money" id="txt_valorTotal_form" placeholder="Valor Total" disabled="disabled" data-affixes-stay="true" data-prefix="R$ " data-thousands="." data-decimal=",">' +
                '    </div>                                                                                                                                                                                                  ' +
                '</div>                                                                                                                                                                                                      ' +
                '<div class="row">                                                                                                                                                                                           ' +
                '    <div class="col-md-12">                                                                                                                                                                                 ' +
                '        <div class="form-group">                                                                                                                                                                            ' +
                '            <div class="modal-footer">                                                                                                                                                                      ' +
                '                <a class="btn btn-default btn_sair" role="button" data-dismiss="modal"><i class="glyphicon glyphicon-remove"></i>                                                                           ' +
                '                    Sair</a>                                                                                                                                                                                ' +
                '                <a class="btn btn-primary btn_confirmar" role="button"><i class="glyphicon glyphicon-ok"></i>                                                                                               ' +
                '                    Salvar</a>                                                                                                                                                                              ' +
                '            </div>                                                                                                                                                                                          ' +
                '        </div>                                                                                                                                                                                              ' +
                '    </div>                                                                                                                                                                                                  ' +
                '</div>                                                                                                                                                                                                      ',
            className: 'dialogo',
        })
        .on('shown.bs.modal', function () {
            setDadosForm(dados);
            $("#txt_descricao").focus();
            $('.money').maskMoney();
            calcularValorTotalModal();
        });
}

function calcularValorTotalModal() {
    var total = 0;
    $("#txt_quantidade").keyup(function () {
        total = $("#txt_valorUnitario").maskMoney('unmasked')[0] * $(this).val();
        $("#txt_valorTotal_form").val(total.toFixed(2));
    })
    $("#txt_valorUnitario").keyup(function () {
        total = $("#txt_quantidade").val() * $(this).maskMoney('unmasked')[0];
        $("#txt_valorTotal_form").val(total.toFixed(2));
        $("#txt_valorTotal_form").trigger('keyup');
    })
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }