
document.addEventListener('DOMContentLoaded', function(){

    let shark_button = document.querySelector('.bot-button')

    let x = 0;
    let y = 0;

    let shark = document.querySelector('div #shark')

    function shark_setpos(a,b) {
        shark.style.left = a + 'px';
        shark.style.top = b + 'px';
    }

    shark_button.addEventListener('click', function(event){
        x += 10;
        y += 10;

        shark_setpos(x,y);


        console.log(shark)
        console.log(event.target)
    })


})
