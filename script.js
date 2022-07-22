// function for email validation 
const validateEmail = (email) => {
    let valid = String(email).toLowerCase().match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    );
    return valid;
};

// function to validate form 
const validateForm = (name, email) =>{   
    // make sure name has text entered and email is valid
    if(name.length > 0 && validateEmail(email)){
        return true;
    }else{
        return false;
    };
};

// function to submit form to database
const submitForm = (body) =>{
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(body)
    }).then(res=>{
        console.log("success");
        // clear form
        document.getElementById("contactForm").reset();
    }).catch(err=>{
        console.log(err);
    });
};

// add submission listener
window.onload = () =>{
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function(e){
        // validate form 
        const name = document.getElementById("fname").value;
        const email = document.getElementById("femail").value;
        const isValid = validateForm(name, email);
        // if valid - submit form for database entry and email confirmation 
        if(isValid){
            document.getElementById("errorMessage").style.display ="none";
            body = {
                name: name,
                email: email
            };
            submitForm(body);
        }else{
            // prevent submission
            e.preventDefault();
            document.getElementById("errorMessage").style.display ="inline";
        };        
    });
};