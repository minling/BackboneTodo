var Todo = Backbone.Model.extend({
  defaults: {
    task: '',
    priority: ''
  }
});

// var parse = require('parse');

var CompletedTodo = Backbone.Model.extend({
  defaults: {
    completedTask: '',
    completedPriority: ''
  }
});

var Todos = Backbone.Collection.extend({
  // url: 'https://G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN:javascript-key=5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB@api.parse.com/1/classes/TodoObject/G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN'
});

var todos = new Todos();

var CompletedTodos = Backbone.Collection.extend({});

var completedTodos = new CompletedTodos();

//Backbone view for one todo
var TodoView = Backbone.View.extend({
  model: new Todo(),
  tagName: 'tr',
  initialize: function() {
    this.template = _.template($('.todos-list-template').html());
  },
  events: {
    'click .finished-todo': 'done',
    'click .delete-todo' : 'delete'
  },
  done: function() {
    var completed = new CompletedTodo({
      completedTask: this.$('.task').html(),
      completedPriority: this.$('.priority').html()
    });
    debugger;
    completedTodos.add(completed);
    this.model.destroy();
  },
  delete: function() {
    this.model.destroy();
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

//Backbone view for all todos
var TodosView = Backbone.View.extend({
  model: todos,
  el: $('.todos-list'), 
  initialize: function() {
    this.model.on('add', this.render, this);
    this.model.on('remove', this.render, this);
    Parse.initialize("G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN", "5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB");
    (new Parse.Query('TodoObject'))
      .find()
      .then(function(response) {
        // debugger;
        // var output = "";
        // for (var i in response ) {
        //   var task = response[i].get("task");
        //   var priority = response[i].get("priority");
        //   output += '<li><td><span class="task">' + task + '</span></td>'
        //   output += '<td><span class="task">' + priority + '</span></td>'
        //   output += '<td><button class="btn btn-info finished-todo">Finished</button></td>' + '<td><button class="btn btn-danger delete-todo">Delete</button></td><li>'
        // }
        // $('.todos-list').append(output);
        response.forEach( function(object) {
          // debugger;
          var task = object.get('task')
          var priority = object.get('priority')
          var taskTd = '<tr><td><span class="task">' + task + '</span></td>'
          var priorityTd = '<td><span class="task">' + priority + '</span></td>'
          var buttons = '<td><button class="btn btn-info finished-todo">Finished</button></td>' + '<td><button class="btn btn-danger delete-todo">Delete</button></td></tr>'
          // debugger;

          $('.todos-list').append(taskTd + priorityTd + buttons)
        })
      })
    // this.model.fetch({
    //   success: function(response){
    //     _.each(response.toJSON(), function(item) {
    //       console.log('Successfully GOT todo with _id: '+ item._id);
    //     });
    //   },
    //   error: function() {
    //     console.log('Failed to get blogs!');
    //   }
    // })
  },
  render: function() {
    var self = this;
    _.each(this.model.toArray(), function(todo) {
      self.$el.append((new TodoView({model: todo})).render().$el);
    });
    return this;
  }
});

//View for one Completed Todo
var CompletedTodoView = Backbone.View.extend({
  model: new CompletedTodo(),
  tagName: 'tr',
  initialize: function() {
    this.template = _.template($('.completed-todos-template').html());
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

//View for all Completed Todos
var CompletedTodosView = Backbone.View.extend({
  model: completedTodos,
  el: $('.completed-todos-list'), 
  initialize: function() {
    this.model.on('add', this.render, this);
  },
  render: function() {
    var self = this;
    this.$el.html('');
    _.each(this.model.toArray(), function(completedTodo) {
      self.$el.append((new CompletedTodoView({model: completedTodo})).render().$el);
    });
    return this;
  }
});

var todosView = new TodosView();
var completedTodosView = new CompletedTodosView();


$(document).ready(function() {
  $('.add-todo').on('click', function() {
    var todo = new Todo({
      task: $('.task-input').val(),
      priority: $('.priority-input').val()
    });
    var taskInput = $('.task-input').val()
    var priorityInput = $('.priority-input').val()
    Parse.initialize("G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN", "5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB");
    var TodoObject = Parse.Object.extend("TodoObject");
    var todoObject = new TodoObject();
    todoObject.save({task: taskInput, priority: priorityInput})
    $('.task-input').val('');
    $('.priority-input').val('');
    todos.add(todo);
    console.log(todos);
  });
});





