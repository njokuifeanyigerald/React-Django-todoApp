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
      console.log(data)
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
    const create = 'http://127.0.0.1:8000/api/task-create/'
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
            completed:false
          }
        }
      })
    }).catch(err => console.log(err))

  }
  render() {
    const tasks  = this.state.todoList;
    // const title = this.state.activeItem.title;
    // console.log(title)
    return (
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
                  <input className="form-control" onChange={this.handleChange} value={this.state.activeItem.title} type="text"  name="title" placeholder="title" />
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
                  <div style={{flex:6}} >{task.title}</div>
                  <div style={{flex:1}} >
                    <button className="btn btn-sm btn-outline-warning">Edit</button>
                  </div>
                  <div style={{flex:1}} >
                    <button className="btn btn-sm btn-outline-danger" >Delete</button>
                    </div>
                </div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }
}
export default App;