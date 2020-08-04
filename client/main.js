// const { response } = require("express");

// const baseURL = 'https://stormy-island-91493.herokuapp.com'
const baseURL = 'http://localhost:3000'

$( document ).ready(function() {
    // Handler for .ready() called.
    auth()
    // console.log('berhasil masuk')
    // $('#login').submit(function(event) {
    //     event.preventDefault()
    //     let email = $('#email').val()
    //     let password = $('#password').val()
    //     console.log(email, password, '<<<<<')
    // })
  });
 

//date
function today() {
    const date =  Date()
    const today = date.split(" ")
    return `${today[0]} ${today[1]} ${today[2]}`
}

$("#date").text(today())


//ADD NEW TASK



function logout() {
    localStorage.clear()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    auth()
}  

function auth() {
    if(localStorage.getItem('token')) {
        fetchTodos()
        $('.login-page').hide()
        $('.register-page').hide()
        $('.home-page').show()
        // $('.add-page').hide()
        $('.form-task').hide()
        $('.form-taskEdit').hide()
        $('.edit-page').hide()
        $('.weather-page').hide()
    } else {
        $('.register-page').hide()
        $('.login-page').show()
        $('.home-page').hide()
        $('.add-page').hide()
        $('.edit-page').hide()
        $('.weather-page').hide()
    }
}

function back() {
    $('.register-page').hide()
    $('.login-page').show()
    $('.home-page').hide()
    $('.form-task').hide()
    $('.edit-page').hide()
} 



function toRegister(event) {
    event.preventDefault()
    $('.login-page').hide()
    $('.register-page').show()
    $('.home-page').hide()
    $('.add-page').hide()
    $('.edit-page').hide()
}

function register(event) {
    event.preventDefault()
    let email = $('#email-reg').val()
    let password = $('#password-reg').val()
    $.ajax({
        method: 'post',
        url: baseURL + '/users/register',
        data: {email, password}
    })
    .done(data => {
        console.log(data)
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message)
    })
}

function login(event) {
    event.preventDefault() //  ini untuk prevent page nya reload saat di submit
    let email = $('#email').val()
    let password = $('#password').val()
    // console.log(email, password, '<<<<<')
    $.ajax({
        method: 'post',
        url: baseURL + '/users/login',
        data: {email, password}
    })
    .done(data => {
        console.log(data)
        localStorage.setItem('token', data.token) // penanda apakah user udah login atau tidak
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message)
    })
    .always(_ => {
        $('#email').val('');
        $('#password').val('')
    })
}


function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'post',
        url: baseURL + `/users/googleSign`,
        data: { id_token }
    })
    .done(data => {
        console.log(data, 'ini data')
        console.log(data.id_token, data.access_token)
        localStorage.setItem('token', data.access_token)
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.errors, 'ini error')
    })
  
  }


function fetchTodos() {
    $('.task').empty()
    $.ajax({
        method:'get',
        url: baseURL+ '/todos',
        headers: {
            acces_token: localStorage.token
        }
    })
    .done(response => {
        // console.log(data['Todos'][0]['title'])
        console.log(response)
        var data = response
        // console.log(data)
        if(data) {
            data.forEach(element => {
                $('.task').append(`            
              <div class="card w-75 mt-3" style="background-color: #f5bd82; width: 900px">
                <div class="card-body">
                <div class="row">
                <div class="col-6">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">${element.due_date}</p>
                </div>
                <div class="col-6">
                <h6>Note : </h6>
                <p class="card-text">${element.description}</p>
                </div>
                </div>
					<a href="#" class="btn btn-primary mt-4" onclick="deleteTodo(${element.id})">Done</a>
					<a href="#" class="btn btn-success mt-4 ml-3" onclick="editTodos(${element.id})">Edit</a>
				</div>
			</div>         
            `)
            });
        } 
    })
    .fail(err => {
        console.log(err)
    })
}


function addTask() {
    // $('.home-page').hide()
    $('.form-task').show()
}

function seeWeather() {
    // $('.home-page').hide()
    $('.weather-page').show()
}

function searchWeather (event) {
    event.preventDefault()
    let city = $('#city-weather').val()
    $('.weather-data').empty()
  $.ajax({
      method:'get',
      url: baseURL + `/weather/${city} `
  })
  .done(data => {
    data.main.temp = Math.round(data.main.temp - 273,15); 
      $('.weather-data').append(`
      <h5 class="card-title">${data.name}</h5>
                <p class="card-text">Enjoy Your Day and Have Fun <i class="fa fa-smile-o"></i></p>
              </div>
              <ul class="list-group list-group-flush" style="background: #f5bd82;">
                <li class="list-group-item">Temp : ${data.main.temp} *C </li>
                <li class="list-group-item">Humidity : ${data.main.humidity}%</li>
                <li class="list-group-item">Wind : ${data.wind.speed} m/s</li>
              </ul>
      `)
      console.log(data.name)
  })
  .fail(err => {
    console.log(err.responseJSON.message)
  })
 }

let currentId = null
function editTodos(id) {
    $.ajax({
        method:'get',
        url: baseURL + `/todos/${id}`,
        headers:{
            acces_token: localStorage.token
        }
    })
    .done(data => {
        // console.log(data)
        currentId = data.id
        $('.form-taskEdit').show()
        // $('.home-page').hide()
        $('#title-taskEdit').val(`${data.title}`)
        $('#description-taskEdit').val(`${data.description}`)
        // $('#edit-status').val(`${data.status}`)
        $('#date-taskEdit').val(`${data.due_date}`)
    })
    .fail(err => {
        console.log(err.responseJSON.message)
    })

}

function updateTodo() {
    let title = $('#title-taskEdit').val()
    let description = $('#description-taskEdit').val()
    // let status = $('#estatus').val()
    let date =   $('#date-taskEdit').val()

    $.ajax({
        method: 'put',
        url: baseURL + `/todos/${currentId}`,
        headers:{
            acces_token: localStorage.token
        },
        data: {title:title, description:description, status:status, due_date: date}
    })
    .done(data => {
        fetchTodos()
        toHome()
        // console.log(data)
    })
    .fail(err => {
        console.log(err.responseJSON) 
    })
}


function toHome() {
    $('.home-page').show()
    $('.form-task').hide()
    $('.form-taskEdit').hide()
    $('.edit-page').hide()
    $('.weather-page').hide()
}

function addNewTodo(event) {
    event.preventDefault()
    let title = $('#title-task').val()
    let description = $('#description-task').val()
    // let status = $('#status').val()
    let due_date = $('#date-task').val()
    var date = new Date($("#date-task").val())
    console.log(due_date)
    // console.log(typeof(due_date))
    $.ajax({
        method:'post',
        url: baseURL + '/todos/add',
        headers: {
            acces_token: localStorage.token
        },
        data : {title : title, description: description, due_date: due_date}
    })
    // console.log(headers)
    .done( data => {
        fetchTodos()
        toHome()
        console.log(data, '<<<<< Data')
    })
    .fail(err => {
       console.log(err.responseJSON) 
    })
}


function deleteTodo(id) {
    $.ajax({
        method: 'delete',
        url: baseURL + `/todos/delete/${Number(id)}`,
        headers: {
            acces_token: localStorage.token
        }
    })
    .done(data => {
        fetchTodos()
    })
    .fail(err =>{
        console.log(err.responseJSON)
    })
}


