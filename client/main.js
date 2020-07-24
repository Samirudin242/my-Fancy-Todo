// const { response } = require("express");

const baseURL = 'https://stormy-island-91493.herokuapp.com'

$( document ).ready(function() {
    // Handler for .ready() called.
    auth()
    console.log('berhasil masuk')
    // $('#login').submit(function(event) {
    //     event.preventDefault()
    //     let email = $('#email').val()
    //     let password = $('#password').val()
    //     console.log(email, password, '<<<<<')
    // })
  });
 
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
        $('.add-page').hide()
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
    $('.add-page').hide()
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
        // console.log(data)
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
    console.log('masuk fetch')
    let email = $('#email').val()
    $('.table-data').empty()
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
        data = response
        // console.log(data)
        if(data) {
            console.log('masuk kedalam if')
            // for(let i = 0; i < data.length; i++) {
            //     console.log(data[i])
            //     console.log(data.length)
            //     $('.table-data').append(`
                    
            //           <tr>
            //             <th scope="row">${data[i].title}</th>
            //             <td>${data[i].description}</td>
            //             <td>${data[i].status}</td>
            //             <td>${data[i].due_date}</td>
            //             <td><button class="btn btn-success" onclick='editTodos(${data[i].id})'>Edit</button> <button onclick="deleteTodo(${data[i].id})"  class="btn btn-danger">Delete</button></td>
            //           </tr>
                    
            //     `)
            // }
            data.forEach(element => {
                $('.table-data').append(`
                    
                      <tr>
                        <th scope="row">${element.title}</th>
                        <td>${element.description}</td>
                        <td>${element.status}</td>
                        <td>${element.due_date}</td>
                        <td><button class="btn btn-success" onclick='editTodos(${element.id})'>Edit</button> <button onclick="deleteTodo(${element.id})"  class="btn btn-danger">Delete</button></td>
                      </tr>
                    
                `)
            });
        } else {
            $('.table-data').append(`
                    
                <tr>
                <th scope="row">Please add Your Task</th>
                </tr>
                    
          `)
        }
        
    })
    .fail(err => {
        console.log(err)
    })
}


function addTodos() {
    $('.home-page').hide()
    $('.add-page').show()
}

function seeWeather() {
    $('.home-page').hide()
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
        $('.edit-page').show()
        $('.home-page').hide()
        $('#edit-title').val(`${data.title}`)
        $('#edit-description').val(`${data.description}`)
        $('#edit-status').val(`${data.status}`)
        $('#edit-date').val(`${data.due_date}`)
    })
    .fail(err => {
        console.log(err.responseJSON.message)
    })

}

function updateTodo() {
    let title = $('#edit-title').val()
    let description = $('#edit-description').val()
    let status = $('#edit-status').val()
    let date =   $('#edit-date').val()

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
    $('.add-page').hide()
    $('.edit-page').hide()
    $('.weather-page').hide()
}

function addNewTodo(event) {
    event.preventDefault()
    let title = $('#title').val()
    let description = $('#description').val()
    let status = $('#status').val()
    let due_date = $('#date').val()

    $.ajax({
        method:'post',
        url: baseURL + '/todos/add',
        headers: {
            acces_token: localStorage.token
        },
        data : {title, description, status, due_date}
    })
    // console.log(headers)
    .done( data => {
        fetchTodos()
        toHome()
        // console.log(data, '<<<<< Data')
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


