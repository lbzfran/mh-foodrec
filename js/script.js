import {fs} from 'fs';
async function python_run() {
    try {
        const response = await fetch('http://127.0.0.1:500/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
    } catch (err) {
        console.error("Fetch error:", err);
    }
}


document.addEventListener('DOMContentLoaded', function(){

    let shark_button = document.querySelector('.bot-button')

    let shark = document.querySelector('div #shark')

    shark_button.addEventListener('click', function(event){

        event.target.style.display = 'none';

        const box = document.getElementById('shark-chat');
        box.style.visibility = 'visible';

        shark.classList.add('horizonTranslate');
        shark.margin = "20%";

        console.log(shark)
        console.log(event.target)
    })


    let choice_idx = 0;
    let quests = [
        //"Hiya!<br>Which county in California are we going to?",
        "Hiya!<br>What state should we look at?",
        "What kind of food are we craving?",
        "Want to specify more?",
    ]
    let choices = [
        //["Los Angeles", "San Bernandino", "Orange County", "San Diego"],
        ['CA', 'NY', 'TX', 'IL'],
        ["Asian", "Italian", "Mexican", "American"],
        ["Sushi", "Seafood", "Thai", "Hawaiian"],
    ]
    let saved_choices = []

    set_outgoing(quests[choice_idx],choices[choice_idx])

    function set_outgoing(quest, opts) {
        const outgoing = document.querySelector('.text.outgoing');
        //alert(outgoing)
        outgoing.innerHTML = "";

        // quest(['Hiya! Where county in California are we going to?'])
        const incoming = document.querySelector('.text.incoming');
        incoming.innerHTML = "";
        incoming.appendChild(create_p(quest));
        // add button options
        for (let i = 0; i < 4; i+=1) {
            outgoing.appendChild(create_button(opts[i]))
        }
    }

    function create_button(name) {
      const newButton = document.createElement('button');

      //newButton.attributes
      newButton.innerHTML = name;

      newButton.classList.add("answers");

      newButton.addEventListener('click', function(e) {
          saved_choices.push(e.target.innerHTML)
          if (choice_idx < 2) {
              choice_idx += 1;
              set_outgoing(quests[choice_idx], choices[choice_idx]);
          } else {
            // finished asking
            console.log(saved_choices);
            // create text file
            save_choices();
            // call python
            python_run()
            .then(function() {
                fetch('recsys/data/processed.json')
                    .then((response) => response.json())
                    .then((json) => console.log(json));
            })
            .catch(function(err) {
                console.log(err)
            })
          }
      })
      return newButton;
    }

    function save_choices() {
        let n = 3;
        //var fs = require('fs');

        var file = fs.createWriteStream('recsys/input.txt');
        file.on('error', function(err) { console.log(err); });
        file.write(n+'\n')
        file.write(saved_choices[0]+'\n')
        file.write(saved_choices[1]+','+saved_choices[2]+'\n')
        file.end();
    }

    function create_p(question) {
      const newP = document.createElement('p');
      newP.innerHTML = question;
      newP.classList.add("shark-q");
      return newP
    }

})

