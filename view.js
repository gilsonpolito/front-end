window.$ = window.jQuery = require('jquery');
let $ = require('jquery')
let urlAPI = "http://localhost:8084/Backend-Jersey/rest/contatos/"

//função auxiliar que percorre todas as linhas da tabela registrando os eventos nos links (imagens)
function handler(){
	$('.action_delete').each(function() {
		$(this).click(function(evento){
			evento.stopImmediatePropagation()
			evento.preventDefault()
			let tr = $(this).parent().parent();
			if(confirm('Deseja remover o registro contato?')){
				$.ajax({
					type: 'DELETE',
					contentType: 'application/json',
					url: urlAPI + $(this).attr("value"),
					success: function(jqXHR, textStatus, errorThrown){
						tr.remove();
					},
					error: function(jqXHR, textStatus, errorThrown){
						alert('Status: ' + textStatus + '\nTipo: ' + errorThrown + '\nMensagem: ' + jqXHR.responseText);
					}
				})
			}
		})
	})

	$('.action_edit').each(function(){
		$(this).click(function(evento) {
			evento.preventDefault()
			$('#add-to-list').addClass('hidden');
			$('#update-to-list').removeClass('hidden');
			$.ajax({
				type: 'GET',
				contentType: 'application/json',
				url: urlAPI + $(this).attr("value"),
				success: function(jqXHR, textStatus, errorThrown){
					$('#idHidden').val(jqXHR.id);
					$('#nameId').val(jqXHR.nome);
					$('#emailId').val(jqXHR.email);
				},
				error: function(jqXHR, textStatus, errorThrown){
					alert('Status: ' + textStatus + '\nTipo: ' + errorThrown + '\nMensagem: ' + jqXHR.responseText);
				}
			})
		})
	})
}

//registro da ação do botão de inserção de contato
$('#add-to-list').on('click', (evento) => {
	evento.preventDefault()
	let bootstrapValidator = $("#formExemplo").data('bs.validator');
	bootstrapValidator.validate();
	if(!bootstrapValidator.isIncomplete()){
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: urlAPI,
			dataType: "json",
			data: formToJSON(),
			success: function(data, textStatus, jqXHR){
				addEntry(data.id,data.nome, data.email)
				handler()
				$("#formExemplo").get(0).reset()
				$('#add-to-list').addClass('disabled')
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert('Status: ' + textStatus + '\nTipo: ' + errorThrown + '\nMensagem: ' + jqXHR.responseText);
			}
		})
	}
})

//registro da ação do botão de atualização de contato
$('#update-to-list').on('click', (evento) => {
	evento.preventDefault()
	let bootstrapValidator = $("#formExemplo").data('bs.validator');
	bootstrapValidator.validate();
	if(!bootstrapValidator.isIncomplete()){
		$.ajax({
			type: 'PUT',
			contentType: 'application/json',
			url: urlAPI,
			dataType: "json",
			data: formToJSON(),
			success: function(data, textStatus, jqXHR){
				$('#contact-table tr').each(function(){
					if ($(this).find('.action_edit').attr("value") == $('#idHidden').val()){
						$(this).find('#nameIdTb').html($('#nameId').val())
						$(this).find('#emailIdTb').html($('#emailId').val())
						$("#formExemplo").get(0).reset()
						$('#add-to-list').removeClass('hidden')
						$('#add-to-list').addClass('disabled')
						$('#update-to-list').addClass('hidden')
					}
				})
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert('Status: ' + textStatus + '\nTipo: ' + errorThrown + '\nMensagem: ' + jqXHR.responseText);
			}
		})
	}
})

//função auxiliar para gerar objeto no formato JSON
function formToJSON() {
	return JSON.stringify({
		"id": $('#idHidden').val(),
		"nome": $('#nameId').val(),
		"email": $('#emailId').val()
	});
}

//função auxiliar para inserir uma linha na tabela de contatos
function addEntry(id, name, email) {
	let updateString = '<tr><td class = "col-xs-2"><a href="#" class="action_edit" value="'+id+'"><img src="images/editar.jpeg" /></a><a href="#" class="action_delete" value="'+id+'"><img src="images/excluir.jpeg" /></a></td><td id="nameIdTb" class = "col-xs-4">'+ name +'</td><td id="emailIdTb" class = "col-xs-6">'+ email +'</td></tr>'
	$('#contact-table').append(updateString)
}

$(document).ready(function(){
	$.ajax({
		type: 'GET',
		contentType: 'application/json',
		url: urlAPI,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			$.each(data, function(index, itemData) {
				addEntry(itemData.id, itemData.nome, itemData.email)
			});
			handler()
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('Status: ' + textStatus + '\nTipo: ' + errorThrown + '\nMensagem: ' + jqXHR.responseText);
		}
	})
})
