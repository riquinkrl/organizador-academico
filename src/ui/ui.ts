// O script tipo "module" já roda depois que o HTML foi carregado, 
// então não precisamos do document.addEventListener("DOMContentLoaded", ...)

// ==========================================
// 1. LÓGICA DO TEMA DARK/LIGHT
// ==========================================
const btnThemeToggle = document.getElementById('btn-theme-toggle') as HTMLButtonElement | null;
const htmlElement = document.documentElement;

// Checa a preferência salva ao abrir a página
if (localStorage.getItem('theme') === 'dark') {
  htmlElement.classList.add('dark');
}

// Adiciona o evento de clique (agora vai funcionar!)
if (btnThemeToggle) {
  btnThemeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    
    if (htmlElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

// ==========================================
// 2. ANIMAÇÕES DA BIBLIOTECA LUCIDE
// ==========================================
const cards = document.querySelectorAll<HTMLElement>('.metric-card');

cards.forEach((card) => {
  card.classList.add('is-animating');
  setTimeout(() => {
    card.classList.remove('is-animating');
  }, 1000);
});