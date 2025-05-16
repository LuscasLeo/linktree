/**
 * JavaScript para o projeto LinkTree
 */

document.addEventListener('DOMContentLoaded', function() {

  // Inicializar os dropdowns do Bootstrap
  const dropdownElements = document.querySelectorAll('.dropdown-toggle');
  if (dropdownElements.length) {
    dropdownElements.forEach(dropdown => {
      new bootstrap.Dropdown(dropdown);
    });
  }

  // Inicializar o Sortable para arrastar e soltar links (na página admin)
  const sortableContainer = document.getElementById('sortableLinks');
  if (sortableContainer) {
    const sortable = new Sortable(sortableContainer, {
      animation: 150,
      handle: '.handle',
      ghostClass: 'sortable-ghost',
      onEnd: function() {
        // Quando a ordenação termina, salvamos a nova ordem
        updateLinkOrder();
      }
    });
  }

  // Função para atualizar a ordem dos links
  function updateLinkOrder() {
    const linkItems = document.querySelectorAll('#sortableLinks li');
    const linkIds = Array.from(linkItems).map(item => item.getAttribute('data-id'));

    fetch('/admin/links/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ linkIds })
    })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.error('Erro ao atualizar a ordem:', data.message);
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
  }

  // Auto-esconder alertas após 5 segundos
  const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
  if (alerts.length) {
    setTimeout(() => {
      alerts.forEach(alert => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      });
    }, 5000);
  }
});
