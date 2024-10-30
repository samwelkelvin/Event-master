function addInteractivityToFaqs() {
   const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");
   accordionItemHeaders.forEach(accordionItemHeader => {
      accordionItemHeader.addEventListener("click", event => {
      accordionItemHeader.classList.toggle("active");
      const accordionItemBody = accordionItemHeader.nextElementSibling;
      if(accordionItemHeader.classList.contains("active")) {
         accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
      }
      else {
         accordionItemBody.style.maxHeight = 0;
      }
      
      });
   });
}

//load upcoming or events line up
function loadUpcomingEvents() {
   var el = document.getElementById('line-up');
   setTimeout(()=>{
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/getEventsLineUp",true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            // Response
            // Parse this.responseText to JSON object
            var resp = JSON.parse(this.responseText).data;
            //Loop throug json odbject to get data
            let html = '';
            const time = ['10:00 AM','10:30 AM', '11:30 AM', '12:30 PM', '2:00 AM', '3:00 PM'];
            resp.forEach((element,index) => {
               console.log(index);
               html += `<div class="accordion">
               <div class="accordion-item">
               <div class="accordion-item-header active">
               ${element.event_name}
               </div>
               <div class="accordion-item-body" style="max-height: 125px;">
               <div class="accordion-item-body-content">
               <span style="color:orange"><b>Date : </b> ${element.event_date} From <strong>${time[index]}</strong></span> <br> <b>Location : </b> ${element.event_location} <br> <b> Venue : </b> ${element.event_venue}
               </div></div></div> </div>`;
            });
            el.innerHTML += html
         }
      };
      xhttp.send();
},800);
}

//load Past events
function loadPastEvents(year) {
   var year = JSON.stringify({'year':year});
   var el = document.getElementById('past-events');
   setTimeout(()=>{
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/getPastEvents",true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            // Response
            // Parse this.responseText to JSON object
            var resp = JSON.parse(this.responseText).data;
            //Loop throug json odbject to get data
            let html = '';
            resp.forEach(element => {
               html += `<div class="accordion">
               <div class="accordion-item">
               <div class="accordion-item-header active">
               <b>Event </b>  ${element.event_name}
               </div>';
               <div class="accordion-item-body" style="max-height: 125px;">
               <div class="accordion-item-body-content">
                <b>Date : </b> ${element.event_date} <br> <b>Location : </b> ${element.event_location} <br> <b> Venue : </b> ${element.event_venue}
               </div></div></div> </div>`;
            });
            el.innerHTML = html
         }
      };
      xhttp.send(year);
},800);
}

//Validate contact info
function validateMail(email) {
   const validMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return validMail.test(email)
}

//function to validate form data and make ajax request
function submitContactInfo(){
   //Evelistener for form submision
   document.getElementById("contact_submit").addEventListener("click", function(e) {
      e.preventDefault();

    //get form iputs
    let name = (document.getElementById("name").value).trim();
    let email = (document.getElementById("email").value).trim();
    let message = (document.getElementById("message").value).trim();

   //get form input fields 
    var namef = document.getElementById("name");
    var emailf = document.getElementById("email");
    var messagef = document.getElementById("message")

   //get form error display elements 
    let name_error = document.getElementById('name_error');
    let email_error = document.getElementById('email_error');
    let message_error = document.getElementById('message_error');
    var response_text = document.getElementById('server_response');

    let validated = true;
      //validate  name
         if (name == "") {
            validated = false;
            name_error.classList.add('error');
            namef.style.border = '2px solid red';
            name_error.innerHTML = 'Name is required';
         } else {
            name_error.classList.remove('error');
            namef.style.border = '2px solid green';
            name_error.innerHTML = '';
         }

       

         //validate message
         if (message == "") {
            validated = false;
            message_error.classList.add('error');
            messagef.style.border = '2px solid red';
            message_error.innerHTML = 'Message is required';
         } else {
            message_error.classList.remove('error');
            messagef.style.border = '2px solid green';
            message_error.innerHTML = '';
         }

         //check if email is empty
         if(email == ''){
            validated = false;
            email_error.classList.add('error');
            emailf.style.border = '2px solid red';
            email_error.innerHTML = 'Email is required';
      }else{
            //check if email is valid
         if (validateMail(email) == false)
         {
               validated = false;
               email_error.classList.add('error');
               emailf.style.border = '2px solid red';
               email_error.innerHTML = 'Enter a valid email';
            }else{
               email_error.classList.remove('error');
               emailf.style.border = '2px solid green';
               email_error.innerHTML = '';
            }
      }

    //if validation is true submit form via ajax else return false and errors
    if (validated == false) {
         console.log('Errors')
       return false;
  }else{

       //form json from data
       var formData = JSON.stringify({'name': name,'email':email,'message':message});

      // if form validate successfully make ajax call
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/addContactInfo",true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            // Response
            // Parse this.responseText to JSON object
            var response = JSON.parse(this.responseText);
            console.log(response)
            
            //if there was an error show else show successs
            if (response.error) {
               //an error occured
               response_text.innerHTML = response.message;
               response_text.classList.add('res-error');
            } else {
               //data inserted successfully
               response_text.innerHTML = response.message;
               response_text.classList.add('res-sucess');
            }
         }
      };
      xhttp.send(formData);
      //return true
  }
   
   });
}
