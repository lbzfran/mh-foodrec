
document.addEventListener('DOMContentLoaded', function(){
  
  
  let x = document.getElementById('shark').style.left;
  let y = document.getElementById('shark').style.right;
  

  let shark = document.getElementById('shark')
  let shark_button = document.querySelector('.bot-button')
  function moveShark(e){
    x -= 25;
    e.style.left = x + 'px';
  }

  shark_button.addEventListener('click', function(event){
    moveShark(event);
    console.log(event.target)
  })

  
})
