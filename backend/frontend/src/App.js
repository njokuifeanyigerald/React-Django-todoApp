import React, { Component } from 'react'
import './App.css'
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      activeItem: {
        id:null,
        title:'',
        completed:false,
      },
      editing:false
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.delete = this.delete.bind(this)
    this.strikeUnStrike = this.strikeUnStrike.bind(this)
  };

  componentWillMount(){
    this.fetchTasks()
  }


  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  fetchTasks(){
    console.log('hello');
    fetch('http://127.0.0.1:8000/api/task-list/')
    .then(res => res.json())
    .then((data) => {
      this.setState({
        todoList: data
      })
    })
  }


  handleChange(e){
    const name = e.target.name
    const value = e.target.value
    // this.setState({[e.target.name]: e.target.value});
    console.log(name)
    console.log(value)
    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
    
  }
  
  handleSubmit(e){
    e.preventDefault()
    console.log(this.state.activeItem)
    const cookie = this.getCookie('csrftoken')
    var create = 'http://127.0.0.1:8000/api/task-create/'

    if(this.state.editing === true){
      create = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing:false
      })
    }
    fetch(create, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken':cookie,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then(response => {
      this.fetchTasks()
      this.setState({
        activeItem:{
          activeItem: {
            id:null,
            title:'',
            completed:false,
          }
        }
      })
    }).catch(err => console.log(err))

  }
  delete(task){
    const cookie = this.getCookie('csrftoken')
    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`,{
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken':cookie,
      }
    }).then(response => {
      this.fetchTasks()
    })

  }

  startEdit(task){
    this.setState({
      activeItem: task,
      editing:true
    })
  }

  strikeUnStrike(task){
    task.completed =  !task.completed
    const cookie = this.getCookie('csrftoken')
    const create = `http://127.0.0.1:8000/api/task-update/${task.id}/`
    fetch(create, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken':cookie
      },
      body: JSON.stringify({'completed': task.completed, "title": task.title})
    }).then(() => {
      this.fetchTasks()
    })

    console.log(task.completed)
  }
  render() {
    const tasks  = this.state.todoList;
    const self = this;
    return (
      <div>
        <div className="container">
        <br/>
        <div className="text-center">
          <h1><b>BlackLivesMatter</b></h1>
          <h2 className="text-capitalize text-white">react django todo app</h2>
        </div>
        <div className="task-container"> 
          <div className="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex: 6}} className="mr-2">
                  <input className="form-control" id="title" onChange={this.handleChange} value={this.state.activeItem.title} type="text"  name="title" placeholder="title" />
                </div>
                <div style={{flex: 1}} className="ml-3">
                  <input className="btn btn-outline-success" type="submit" id="submit" name="Add" />
                </div>
              </div>
            </form>
          </div>
          <hr className="my-4"/>
          <div id="list-wrapper ">
              {tasks.map((task) =>{
                return (
                <div key={task.id} className="task-wrapper flex-wrapper" >
                  <div style={{flex:6}} onClick={() => self.strikeUnStrike(task)} >
                  {task.completed === false  ?(<span>{task.title}</span>) :
                  (<strike>{task.title}</strike>)
                  }
                </div>
                  
                  <div style={{flex:1}} >
                    <button onClick={() =>self.startEdit(task)} className="btn btn-sm btn-outline-warning">Edit</button>
                  </div>
                  <div style={{flex:1}} >
                    <button onClick ={() => self.delete(task)} className="btn btn-sm btn-outline-danger" >Delete</button>
                    </div>
                </div>
                )
              })}
          </div>
        </div>
      </div>
      <div className="footer mt-4 text-center text-white">
            BopGeek &copy; 2020
      </div>
    </div>
      
    )
  }
}
export default App;