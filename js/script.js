
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

        shark.classList.add('horizonTranslate');
        shark.margin = "20%";

        console.log(shark)
        console.log(event.target)
    })

  


    set_outgoing(['LA','SB', 'OC'])

    function set_outgoing(values) {
      const outgoing = document.querySelector('.text.outgoing');
      //alert(outgoing)
      outgoing.innerHTML = "";

      

      // quest(['Hiya! Where county in California are we going to?'])
      const incoming = document.querySelector('.text.incoming');
      incoming.innerHTML = "";
      incoming.appendChild(create_p("Hiya!<br> Which county in California are we going to?"));

      // add button options
      for (i in values) {
        outgoing.appendChild(create_button(values[i]))
      }
    }
  
    function create_button(name) {
      const newButton = document.createElement('button');

      //newButton.attributes
      newButton.innerHTML = name;

      newButton.classList.add("answers");

      newButton.addEventListener('click', function(e) {
        set_outgoing(['Asian','Italian','American', 'Latina American'])

        const incoming = document.querySelector('.text.incoming');
        incoming.innerHTML = "";
        incoming.appendChild(create_p("What kind of food are we craving?"));
      })
      return newButton;
    }

    function create_p(question) {
      const newP = document.createElement('p');
      newP.innerHTML = question;
      newP.classList.add("shark-q");
      return newP
    }
})

