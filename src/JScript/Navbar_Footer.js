const navbar1 = document.getElementById('navbar1');
if (navbar1){
  fetch('../Components/navbar1.html').then(r=>r.text()).then(data=>{
    navbar1.innerHTML=data;
    window.YeyaAuth?.actualizarUI();
    window.YeyaStoreConfig?.aplicar(navbar1);
  }).catch(error=>console.error('Hubo un error al cargar el navbar1:',error));
}
const navbar2 = document.getElementById('navbar2');
if (navbar2){
  fetch('../Components/navbar2.html').then(r=>r.text()).then(data=>{
    navbar2.innerHTML=data;
    window.YeyaAuth?.actualizarUI();
    window.YeyaStoreConfig?.aplicar(navbar2);
  }).catch(error=>console.error('Hubo un error al cargar el navbar2:',error));
}
const footer1 = document.getElementById('footer1');
if (footer1){
  fetch('../Components/footer.html').then(r=>r.text()).then(data=>{
    footer1.innerHTML=data;
    window.YeyaStoreConfig?.aplicar(footer1);
  }).catch(error=>console.error('Hubo un error al cargar el footer:',error));
}
