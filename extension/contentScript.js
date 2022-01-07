/* Appending button to webpage */
var main = document.createElement('DIV');
var buttons = document.createElement('BUTTON');

main.classList.add('main');
buttons.value = "verify News"
buttons.type = 'submit';
buttons.id = 'button';
buttons.textContent = 'Verify';

main.appendChild(buttons)
document.querySelector(".IC1Ck").appendChild(main);

/* Allow toggle button to call the function */
// document.getElementById("myCheckbox").addEventListener("click", toggleCheck);


/* Toggle function */
// function toggleCheck() {
//     if(document.getElementById("myCheckbox").checked === true){
//         var main = document.createElement('DIV');
//         var buttons = document.createElement('BUTTON');
//         main.appendChild(buttons);
//         document.querySelector(".IC1Ck").appendChild(main);
        
//         main.classList.add('main');
//         buttons.value = "verify News"
//         buttons.type = 'submit';
//         buttons.id = 'button';
//         buttons.textContent = 'Verify';
        
//         main.appendChild(buttons)
//         document.querySelector(".IC1Ck").appendChild(main);
//     }
//     else{
//         document.getElementById('myCheckbox').style.display = "none";
//     }

// }



