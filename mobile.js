// Simple mobile SPA router and UI behaviors
const routes = {
  home: () => `
    <section class="section-hero">
      <h1>Assessoria Especializada em Departamento Pessoal</h1>
      <p>Apoio técnico e segurança para o crescimento do seu negócio.</p>
      <a class="btn" href="#servicos">Nossas Soluções</a>
    </section>
    <section class="section-cards">
      <div class="card"><div class="icon">🏢</div><div><h3>Empresas</h3><p style="margin:4px 0;">BPO completo, gestão de folha e compliance trabalhista.</p></div></div>
      <div class="card"><div class="icon">👤</div><div><h3>MEI</h3><p style="margin:4px 0;">Regularização e gestão de funcionários para microempreendedores.</p></div></div>
      <div class="card"><div class="icon">🏠</div><div><h3>Domésticas</h3><p style="margin:4px 0;">Tranquilidade total na gestão do eSocial e encargos.</p></div></div>
    </section>
  `,
  servicos: () => `
    <section>
      <h2 style="margin-bottom:10px">Serviços</h2>
      <div class="section-cards">
        <div class="card"><div class="icon">🏢</div><div><h3>Empresas</h3><p style="margin:4px 0;">BPO completo, gestão de folha e compliance trabalhista.</p></div></div>
        <div class="card"><div class="icon">👤</div><div><h3>MEI</h3><p style="margin:4px 0;">Regularização e gestão de funcionários para microempreendedores.</p></div></div>
        <div class="card"><div class="icon">🏠</div><div><h3>Domésticas</h3><p style="margin:4px 0;">Tranquilidade total na gestão do eSocial e encargos.</p></div></div>
      </div>
    </section>
  `,
  contato: () => `
    <section>
      <h2>Solicite um Orçamento</h2>
      <p style="color:#666;margin-bottom:8px;">Deixe seus dados e entraremos em contato em breve.</p>
      <form id="mForm" class="contact-form">
        <input name="name" class="input" placeholder="Seu Nome Completo" required>
        <input name="email" type="email" class="input" placeholder="Seu Melhor E-mail" required>
        <select name="servico" required>
          <option value="" disabled selected>Qual serviço procura?</option>
          <option value="Empresas">Departamento Pessoal para Empresas</option>
          <option value="MEI">Gestão para MEI</option>
          <option value="Domestica">Gestão de Empregada Doméstica</option>
        </select>
        <textarea name="message" placeholder="Como podemos te ajudar?" required></textarea>
        <button class="btn" type="submit">Enviar Mensagem</button>
        <div id="mResult" style="margin-top:8px"></div>
      </form>
      <a class="btn" style="background:#25D366;margin-top:10px;display:inline-block;text-align:center;" href="https://wa.me/5511970152735" target="_blank" rel="noopener">Enviar pelo WhatsApp</a>
    </section>
  `
};

function render() {
  const hash = location.hash.replace('#','') || 'home';
  const view = routes[hash] || routes.home;
  document.getElementById('app').innerHTML = view();
  attachForm();
}

function attachForm(){
  const form = document.getElementById('mForm');
  if (!form) return;
  const result = document.getElementById('mResult');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const data = new FormData(form);
    // include hidden fields similar to desktop form
    data.append('from_name', 'Site Terceiriza DP');
    data.append('subject', 'Novo Contato do Site!');
    // Use same Web3Forms endpoint
    const obj = Object.fromEntries(data.entries());
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body: JSON.stringify(obj)
    }).then(async res=>{
      const j = await res.json();
      if (res.status===200){ result.innerText = 'Mensagem enviada com sucesso!'; result.style.color='green'; form.reset(); }
      else { result.innerText = j.message || 'Erro ao enviar'; result.style.color='red'; }
    }).catch(err=>{ result.innerText='Algo deu errado'; result.style.color='red'; });
  });
}

// Mobile nav toggle
const mToggle = document.getElementById('mToggle');
const mNav = document.getElementById('mNav');
if (mToggle && mNav) {
  mToggle.addEventListener('click', ()=>{
    const open = mNav.classList.toggle('open');
    mToggle.setAttribute('aria-expanded', String(!!open));
    mNav.setAttribute('aria-hidden', String(!open));
  });
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', render);
