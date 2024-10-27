
document.addEventListener('DOMContentLoaded', function(){

    let shark_button = document.querySelector('.bot-button')

    let x = 0;
    let y = 0;

    let shark = document.querySelector('div #shark')

    function shark_setpos(a,b,c) {
        shark.style.left = a + c;
        shark.style.top = b + c;
    }

    function sleep(ms) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > ms) {
                break;
            }
        }
    }

    shark_button.addEventListener('click', function(event){

        event.target.style.display = 'none';

        const box = document.getElementById('shark-chat');
        box.style.visibility = 'visible';

        const send = document.getElementById('send');
        send.style.visibility = 'visible';

        shark.classList.add('horizonTranslate');
        shark.margin = "20%";

        console.log(shark)
        console.log(event.target)
    })
})